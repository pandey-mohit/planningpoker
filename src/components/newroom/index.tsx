import React from "react"
import { Dialog, DialogFooter } from "@fluentui/react/lib/Dialog"
import { PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown"

import styles from "./style.module.css"

interface Props {
  hideDialog: boolean
  toggleHideDialog?: ToggleHideDialog
}

export const NewRoom: React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  const modalProps = React.useMemo(() => ({ isBlocking: true }), [])
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();

  const onChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    setSelectedItem(item)
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
        <TextField label="Room Name" />
        <TextField label="Your Name" />
        <Dropdown
          label="Enter as"
          selectedKey={selectedItem ? selectedItem.key : undefined}
          onChange={onChange}
          placeholder="Select an option"
          options={[
            { key: "participant", text: "Participant" },
            { key: "host", text: "Host" },
            { key: "spectator", text: "Spectator" }
          ]}
        />
      </div>
      <DialogFooter>
        <PrimaryButton text="Start" onClick={toggleHideDialog} />
      </DialogFooter>
    </Dialog>
  )
}