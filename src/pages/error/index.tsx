import React from "react"
import { useNavigate } from "react-router-dom"
import { PrimaryButton } from "@fluentui/react"
import { FontIcon } from "@fluentui/react/lib/Icon"
import styles from "./style.module.css"


const Error: React.FC = (props) => {
  let navigate = useNavigate()
  const onClick = () => {
    navigate("/")
  }

  return (
    <main>
      <div className={`banner ${styles.banner}`}>
        <FontIcon aria-label="Bug" iconName="EmojiDisappointed" className={styles.bug} />
        <section className={styles.section}>
          <span className="ms-fontSize-42">Page Not Found</span>
          <p className={`ms-fontSize-24 ${styles.msg}`}>We can't find the page you're looking for. Please visit our homepage to proceed.</p>
          <PrimaryButton onClick={onClick}>Visit Homepage</PrimaryButton>
        </section>
      </div>
    </main>
  )
}

export default Error