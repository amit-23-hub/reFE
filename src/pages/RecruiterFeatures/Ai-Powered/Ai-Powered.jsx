import React from 'react';
import styles from './Ai-Powered.module.css';
import AiPoweredImage from '../../../assets/ai-powered.png';
import AiDrivenImage from '../../../assets/ai-driven.png';

const AiPowered = () => {
  return (
    <div className={styles.featuresContainer}>
      <div className={styles.feature}>
        <div className={styles.featureContent}>
          <h2>AI-Powered Shortlisting</h2>
          <p>
            Let AI analyze and shortlist the best candidates instantly—saving you time and
            effort while ensuring the perfect fit.
          </p>
        </div>
        <div className={styles.featureImage}>
          {/* Add your image here */}
          <img src={AiPoweredImage} alt="AI-Powered Shortlisting" />
        </div>
      </div>

      <div className={`${styles.feature} ${styles.reverse}`}>
        <div className={styles.featureImage}>
          {/* Add your image here */}
          <img src={AiDrivenImage} alt="AI-Powered Shortlisting" />
        </div>
        <div className={styles.featureContent}>
          <h2>Access Top Talent with AI-Driven Interviews</h2>
          <p>
            Eliminate human bias and save time with AI-powered virtual interviews that assess
            candidates seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPowered;