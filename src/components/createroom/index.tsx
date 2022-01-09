import React, { useEffect, useState } from "react"
// import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogFooter } from "@fluentui/react/lib/Dialog"
import { PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown"

import { register } from "../../pubnub"
import { uniqueIdentifier } from "../../util"
import styles from "./style.module.css"

interface Props {
  hideDialog: boolean
  toggleHideDialog: ToggleHideDialog
}

interface Participant {
  roomName: string,
  userName: string,
  enterAs: string
}

export const CreateRoom: React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  const modalProps = React.useMemo(() => ({ isBlocking: true }), [])
  const [ error, setError ] = React.useState({ roomName: "", userName: "" }) 
  const [participant, setParticipant] = React.useState<Participant>({
    roomName: "",
    userName: "",
    enterAs: "host"
  })

  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setParticipant({
      ...participant,
      [event.currentTarget.name]: newValue
    })
  }

  const onDropDownChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    setParticipant({
      ...participant,
      enterAs: (item || { key: "" }).key.toString()
    })
  }

  const validate = (): boolean => {
    const { roomName, userName } = participant
    let error = {
      roomName: roomName ? "" : "Please enter room name",
      userName: userName ? "" : "Please enter user name"
    }
    setError(error)
    return !(error.roomName || error.userName)
  }

  const navigate = useNavigate()
  const onSubmit = () => {
    if(validate()) {
      const { roomName, userName, enterAs } = participant
      const channelName = uniqueIdentifier().toString()

      const { pubnub, uuid } = register()
      pubnub.subscribe({
        channels: [channelName]
      })
      pubnub.objects.setChannelMetadata({
        channel: channelName,
        data: {
          name: roomName,
          description: "This channel is for company wide chatter.",
          custom: { "owner": userName }
        }
      })
      localStorage.setItem("user", JSON.stringify({
        ...participant,
        channelName
      }))

      // navigate to room page
      navigate(`/room/${channelName}`)

      /*
      pubnub.publish({ channel: channelName.toString(), message: {
          roomName: "edwd",
          userName: "mohit",
          enterAs: "host"
        }
      }).then((data) => {
        console.log('@@@@@@@@@@@@@@@@', data)
        pubnub.subscribe({
          channels: ["my-test-app"]
        })
        pubnub.objects.setChannelMetadata({
          channel: "my-test-app",
          data: {
            name: "my room",
            description: "This channel is for company wide chatter.",
            custom: { "owner": "mohit" }
          }
        })
        pubnub.objects.getChannelMetadata({
          channel: "my-test-app"
        }).then( data => {
          console.log('Channel meta data: ', data)
        })
      })
      */
      // pubnub.subscribe({
      //   channels: ["my-test-app"]
      // })
      // create the channel
      // pubnub.publish({ channel: roomName })
      // pubnub.publish({ channel: roomName, message: participant })
      console.log("call the api")
    }
  }

  return (
    // <PubNubProvider client={pubnub}>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={{
          title: "Create new room"
        }}
        modalProps={modalProps}
        minWidth="480px"
      >
        <div className={styles.content}>
          <TextField label="Room Name" name="roomName" required value={participant.roomName} onChange={onInputChange} errorMessage={error.roomName} />
          <TextField label="Your Name" name="userName" required value={participant.userName} onChange={onInputChange} errorMessage={error.userName} />
          <Dropdown
            label="Enter as"
            disabled={true}
            selectedKey={ participant.enterAs }
            onChange={onDropDownChange}
            placeholder="Select an option"
            options={[
              { key: "participant", text: "Participant" },
              { key: "host", text: "Host" },
              { key: "spectator", text: "Spectator" }
            ]}
          />
        </div>
        {/* <PubNubProvider client={pubnub}>
          <Chat />
        </PubNubProvider> */}
        <DialogFooter>
          <PrimaryButton text="Start" onClick={onSubmit} />
        </DialogFooter>
      </Dialog>
    // </PubNubProvider>
  )
}

// function Chat() {
//   const pubnub = usePubNub();
//   const [channels] = useState(["awesome-channel"]);
//   const [messages, addMessage] = useState([]);
//   const [message, setMessage] = useState("");

  const handleMessage = (event:any) => {
    const message = event.message;
    console.log("message received: ", message)
    // if (typeof message === "string" || message.hasOwnProperty("text")) {
    //   const text = message.text || message;
    //   addMessage(messages => [...messages, text]);
    // }
  };

//   const sendMessage = (message:any) => {
//     if (message) {
//       pubnub.subscribe({
//         channels: ["my-test-app"]
//     })
      // pubnub
      //   .publish({ channel: channels[0], message })
      //   .then(() => setMessage(""))
//     }
//   };
//   let count = 0
//   // setTimeout(() => {
//   //   count++
//   //   sendMessage("test message: " + count)
//   // })
  
//   // useEffect(() => {
//   //   console.log("cellld")
//   //   pubnub.addListener({ message: handleMessage })  
//   //   pubnub.subscribe({ channels });
//   //   pubnub.fetchMessages(
//   //     {
//   //         channels: channels,
//   //         end: "15343325004275466",
//   //         count: 100
//   //     },
//   //     (status, response) => {
//   //         console.log("fetch", response)
//   //     }
//   // )
//   // }, [pubnub, channels]);

//   return (
//     <div>
//       dummmy content
//     </div>
//   );
// }