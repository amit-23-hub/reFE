import React from "react";
import styles from "./RloginLeft.module.css";
import Logo from "./logo";

const RLoginPortion = () => {
  return (
    <div className={styles.signupLeft}>
      <div className={styles.leftContent}>
        <Logo />
        <h1>Sign up</h1>
        <h1>and start hiring in minutes.</h1>
        <span>No lengthy job postings. Just instant matches.</span>
      </div>
    </div>
  );
};

export default RLoginPortion;