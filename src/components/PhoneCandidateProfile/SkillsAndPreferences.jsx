import React from 'react';
import styles from './SkillsAndPreferences.module.css';

const SkillsAndPreferences = ({ 
  skills = [], 
  jobPreferences = {
    salary: 'Not specified',
    locations: [],
    jobModels: [],
    jobTypes: []
  }
}) => {
  // Ensure all arrays exist and are arrays
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeLocations = Array.isArray(jobPreferences.locations) ? jobPreferences.locations : [];
  const safeJobModels = Array.isArray(jobPreferences.jobModels) ? jobPreferences.jobModels : [];
  const safeJobTypes = Array.isArray(jobPreferences.jobTypes) ? jobPreferences.jobTypes : [];

  return (
    <>
      <div className={styles.skillsSection}>
        <h2>Skills</h2>
        <div className={styles.skillsList}>
          {safeSkills.length > 0 ? (
            safeSkills.map((skill, index) => (
              <div key={index} className={styles.skill}>
                {typeof skill === 'object' ? skill.name : skill}
              </div>
            ))
          ) : (
            <div className={styles.skill}>No skills added</div>
          )}
        </div>
      </div>
      
      <div className={styles.jobPreferences}>
        <h2>Job Preferences</h2>
        <div>
          <span>Expected salary: {jobPreferences.salary || 'Not specified'}</span>
          <span>Location: {safeLocations.length > 0 ? safeLocations.join(', ') : 'Anywhere'}</span>
          <span>Job model: {safeJobModels.length > 0 ? safeJobModels.join(', ') : 'Not specified'}</span>
          <span>Job type: {safeJobTypes.length > 0 ? safeJobTypes.join(', ') : 'Not specified'}</span>
        </div>
      </div>
    </>
  );
};

export default SkillsAndPreferences;