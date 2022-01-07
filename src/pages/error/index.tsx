import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PrimaryButton } from "@fluentui/react"
import { BugSolidIcon } from "@fluentui/react-icons-mdl2"
import styles from "./style.module.css"

const Error: React.FC = (props) => {
  let navigate = useNavigate()
  const onClick = () => {
    navigate("/")
  }

  return (
    <div className={`banner ${styles.banner}`}>
      <BugSolidIcon className={styles.bug} />
      <section className={styles.section}>
        <span className="ms-fontSize-42">Page Not Found</span>
        <p className={`ms-fontSize-24 ${styles.msg}`}>We can't find the page you're looking for. Please visit our homepage to proceed.</p>
        <PrimaryButton onClick={onClick}>Visit Homepage</PrimaryButton>
      </section>
    </div>
  )
}

export default Error