import React from "react";
import styles from "../pages/SignUp/Recruiter/SignUp1.module.css";
import Logo from "./logo";
import img from "../assets/RsignupImg.png";
const RLeftPortion = () => {
  return (
    <div className={styles.signupLeft}>
      <div className={styles.leftContent}>
        <Logo />
        <h1>Sign up</h1>
        <h1>and start hiring in minutes.</h1>
        <span>No lengthy job postings. Just instant matches.</span>
        <div className={styles.illustrationContainer}>
          <img 
            src={img}
            alt="Recruitment Illustration" 
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
};

export default RLeftPortion;