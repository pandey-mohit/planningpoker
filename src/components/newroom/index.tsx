import React from "react"
import { Dialog, DialogFooter } from "@fluentui/react/lib/Dialog"
import { PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown"

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

export const NewRoom: React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
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
    toggleHideDialog()
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
      <DialogFooter>
        <PrimaryButton text="Start" onClick={onSubmit} />
      </DialogFooter>
    </Dialog>
  )
}