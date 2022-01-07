import React, { useEffect, useState } from "react"
import axios from "axios"
import { Dialog, DialogFooter } from "@fluentui/react/lib/Dialog"
import { PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown"

import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';

import styles from "./style.module.css"

interface Props {
  hideDialog: boolean
  toggleHideDialog: ToggleHideDialog
}

interface Participant {
  roomName: string,
  userName: string,
  enterAs: IDropdownOption | undefined
}


const pubnub = new PubNub({
  publishKey: 'pub-c-17028d06-6ab7-45e2-864c-7f18a74224e1',
  subscribeKey: 'sub-c-d76c21d8-6f0f-11ec-a2db-9eb9413efc82',
  uuid: 'eece'
});


export const CreateRoom: React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  const modalProps = React.useMemo(() => ({ isBlocking: true }), [])
  const [participant, setParticipant] = React.useState<Participant>({
    roomName: '',
    userName: '',
    enterAs: {
      key: "host",
      text: "Host"
    }
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
      enterAs: item
    })
  }

  const onSubmit = () => {
    console.log(participant)
    axios.post('/message', participant)
    // toggleHideDialog()
  }

  return (
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
        <TextField label="Room Name" name="roomName" value={participant.roomName} onChange={onInputChange} />
        <TextField label="Your Name" name="userName" value={participant.userName} onChange={onInputChange} />
        <Dropdown
          label="Enter as"
          disabled={true}
          selectedKey={participant.enterAs ? participant.enterAs.key : undefined}
          onChange={onDropDownChange}
          placeholder="Select an option"
          options={[
            { key: "participant", text: "Participant" },
            { key: "host", text: "Host" },
            { key: "spectator", text: "Spectator" }
          ]}
        />
      </div>
      <PubNubProvider client={pubnub}>
        <Chat />
      </PubNubProvider>
      <DialogFooter>
        <PrimaryButton text="Start" onClick={onSubmit} />
      </DialogFooter>
    </Dialog>
  )
}

function Chat() {
  const pubnub = usePubNub();
  const [channels] = useState(['awesome-channel']);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');

  const handleMessage = (event:any) => {
    const message = event.message;
    console.log("message received: ", message)
    // if (typeof message === 'string' || message.hasOwnProperty('text')) {
    //   const text = message.text || message;
    //   addMessage(messages => [...messages, text]);
    // }
  };

  const sendMessage = (message:any) => {
    if (message) {
      pubnub
        .publish({ channel: channels[0], message })
        .then(() => setMessage(''));
    }
  };
  let count = 0
  setTimeout(() => {
    count++
    sendMessage("test message: " + count)
  })
  
  useEffect(() => {
    console.log('cellld')
    pubnub.addListener({ message: handleMessage })  
    pubnub.subscribe({ channels });
    pubnub.fetchMessages(
      {
          channels: channels,
          end: '15343325004275466',
          count: 100
      },
      (status, response) => {
          console.log("fetch", response)
      }
  )
  }, [pubnub, channels]);

  return (
    <div>
      dummmy content
    </div>
  );
}