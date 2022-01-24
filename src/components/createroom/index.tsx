import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Dialog, DialogFooter } from "@fluentui/react/lib/Dialog"
import { PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown"

import { register } from "../../pubnub"
import { uniqueIdentifier } from "../../util"
import styles from "./style.module.css"

interface Props {
  room?: string
  hideDialog: boolean
  toggleHideDialog: ToggleHideDialog
}

interface Participant {
  roomName: string,
  userName: string,
  enterAs: string
}

export const CreateRoom: React.FC<Props> = ({ room = "", hideDialog, toggleHideDialog }) => {
  const { roomId } = useParams()
  
  const modalProps = React.useMemo(() => ({ isBlocking: true }), [])
  const [ error, setError ] = React.useState({ roomName: "", userName: "" }) 
  const [participant, setParticipant] = React.useState<Participant>({
    roomName: room,
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
      const { roomName, userName } = participant
      const channelName = uniqueIdentifier().toString()

      const { pubnub } = register(userName)
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
    }
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
        { !roomId && (
          <TextField label="Room Name" name="roomName" required value={participant.roomName} onChange={onInputChange} errorMessage={error.roomName} />
        )}
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
      <DialogFooter>
        <PrimaryButton text="Start" onClick={onSubmit} />
      </DialogFooter>
    </Dialog>
  )
}