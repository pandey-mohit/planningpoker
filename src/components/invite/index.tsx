import React, { useEffect, useRef, useState } from "react"
import { MessageBar, MessageBarType } from "@fluentui/react"
import { Dialog } from "@fluentui/react/lib/Dialog"
import { FontIcon } from "@fluentui/react/lib/Icon"

import styles from "./style.module.css"

interface Props {
  hideDialog: boolean
  toggleHideDialog: ToggleHideDialog
}

export const Invite:React.FC<Props> = ({ hideDialog, toggleHideDialog }) => {
  const modalProps = React.useMemo(() => ({ topOffsetFixed: true }), [])
  let [copyToClipboard, setCopyToClipboard] = useState(false)
  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyToClipboard(true)
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        title: "Invite user to join"
      }}
      modalProps={modalProps}
      minWidth="480px"
    >
      <div className={styles.content}>
        { copyToClipboard && (
          <MessageBar messageBarType={MessageBarType.success}>
            Copied!
          </MessageBar>
        )}
        <pre>
          <FontIcon aria-label="Copy" iconName="Copy" className={`${styles.copy} ${copyToClipboard ? styles.copied : ""}`} onClick={copyURL} />
          <code>{ window.location.href }</code>
        </pre>
      </div>
    </Dialog>
  )
}