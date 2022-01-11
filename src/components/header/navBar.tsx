import React from "react"
import { useNavigate } from "react-router-dom"
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar"

import styles from "./style.module.css"
import { capitalize } from "../../util"

export const LeftNav: React.FC = () => {
  const navigate = useNavigate()
  const navigateToHome = () => {
    navigate("/")
  }

  return (
    <CommandBar
      items={[
        {
          key: "home",
          text: "Home",
          onClick: navigateToHome,
        }
      ]}
      ariaLabel="Use left and right arrow keys to navigate between commands"
      className={styles["left-nav"]}
    />
  )
}

export const RightNav: React.FC = () => {
  const navigate = useNavigate()
  const signout = () => {
    localStorage.clear()
    navigate("/")
  }

  const items: ICommandBarItemProps[] = [
    {
      key: "invite",
      text: "Invite",
      iconProps: { iconName: "Share" },
      onClick: () => console.log("Share"),
    },
    {
      key: "user",
      text: capitalize(JSON.parse(localStorage.getItem("user") || "{}").userName || "User Name"),
      iconProps: { iconName: "Contact" },
      subMenuProps: {
        items: [
          {
            key: "signout",
            text: "SignOut",
            iconProps: { iconName: "SignOut" },
            onClick: signout
          }
        ],
      },
    }
  ]

  return (
    <CommandBar
      className={styles["right-nav"]}
      items={items}
      ariaLabel="Use left and right arrow keys to navigate between commands"
    />
  )
}

