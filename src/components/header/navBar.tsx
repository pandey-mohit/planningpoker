import React from "react"
import { useNavigate } from "react-router-dom"
import { useBoolean } from "@fluentui/react-hooks"
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar"

import { capitalize } from "../../util"
import { Invite } from "../invite"
import "./style.css"

interface NavBarProps {
  rightNav: boolean
}
export const NavBar: React.FC<NavBarProps> = ({ rightNav }) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
  const navigate = useNavigate()
  const navigateToHome = () => {
    navigate("/")
  }

  const signout = () => {
    localStorage.clear()
    navigate("/")
  }

  const leftItems: ICommandBarItemProps[] = [
    {
      key: "home",
      text: "Home",
      ariaLabel: 'Grid view',
      onClick: navigateToHome,
    }
  ]

  const rightItems: ICommandBarItemProps[] = [
    {
      key: "invite",
      text: "Invite",
      iconProps: { iconName: "Share" },
      onClick: () => toggleHideDialog(),
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
    <>
      <CommandBar
        items={leftItems}
        farItems={rightNav ? rightItems : []}
        ariaLabel="Use left and right arrow keys to navigate between commands"
        className="navbar"
      />
      { rightNav && !hideDialog && <Invite hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} /> }
    </>
  )
}

