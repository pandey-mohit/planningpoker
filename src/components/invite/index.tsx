import React from "react"
import { Dialog } from "@fluentui/react/lib/Dialog"
import { FontIcon } from "@fluentui/react/lib/Icon"

import styles from "./style.module.css"

interface Props {
  hideDialog: boolean
  toggleHideDialog: ToggleHideDialog
}

export const Invite:React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  // const modalProps = React.useMemo(() => ({ isBlocking: true }), [])

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        title: "Invite user to join"
      }}
      // modalProps={modalProps}
      minWidth="480px"
    >
      <div className={styles.content}>
        <FontIcon aria-label="Copy" iconName="Copy" className={styles.copy} />
        <pre>
          <code>{ window.location.href }</code>
        </pre>
      </div>
    </Dialog>
  )
}