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
  userName: string,
  enterAs: string
}

export const JoinRoom: React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  const modalProps = React.useMemo(() => ({ isBlocking: true }), [])
  const [ error, setError ] = React.useState({ userName: "" }) 
  const [participant, setParticipant] = React.useState<Participant>({
    userName: "",
    enterAs: "participant"
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
    const { userName } = participant
    let error = {
      userName: userName ? "" : "Please enter user name"
    }
    setError(error)
    return !error.userName
  }

  const onSubmit = () => {
    if(validate()) {
      localStorage.setItem("user", JSON.stringify(participant))
      window.location.reload()
    }
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        title: "Join room"
      }}
      modalProps={modalProps}
      minWidth="480px"
    >
      <div className={styles.content}>
        <TextField label="Your Name" name="userName" required value={participant.userName} onChange={onInputChange} errorMessage={error.userName} />
        <Dropdown
          label="Enter as"
          selectedKey={ participant.enterAs }
          onChange={onDropDownChange}
          placeholder="Select an option"
          options={[
            { key: "participant", text: "Participant" },
            { key: "spectator", text: "Spectator" }
          ]}
        />
      </div>
      <DialogFooter>
        <PrimaryButton text="Join" onClick={onSubmit} />
      </DialogFooter>
    </Dialog>
  )
}