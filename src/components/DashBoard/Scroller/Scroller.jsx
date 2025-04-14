import React, { useState } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';
import styles from './Scroller.module.css';
import { useNavigate } from 'react-router-dom';

const Scroller = ({ jobDetails, keywords, onRegenerate }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate(); // Add this

  const handleFindCandidates = async () => {
    try {
      const requestBody = {
        jd_json: {
          full_description: {
            job_title: jobDetails.title,
            tags: jobDetails.tags,
            about_the_role: jobDetails.description,
            job_type_workplace_location: `${jobDetails.type}, ${jobDetails.workplace}, ${jobDetails.location}`,
            key_responsibilities: jobDetails.responsibilities,
            requirements: jobDetails.requirements
          }
        }
      };

      const response = await fetch('http://20.193.128.47:8010/match-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform candidates data
      const candidates = data.matches.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        role: candidate.title,
        description: candidate.summary,
        location: candidate.location,
        education: candidate.education,
        experience: `${candidate.yearsExperience} years`,
        noticePeriod: candidate.availability,
        matchPercentage: Math.round(candidate.matchScore),
        matches: 5,
        interviewing: 2,
        skills: candidate.matchingDetails.Skills || [],
        whatMatched: candidate.whatMatched,
        matchingDetails: candidate.matchingDetails
      }));

      // Navigate to FindCandidate page with the data
      navigate('/findcandidate', {
        state: {
          jobDetails,
          candidates,
          keywords
        }
      });

    } catch (error) {
      console.error('Error fetching candidates:', error);
      // Add error handling here
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!jobDetails) {
    return <div className={styles.WholeContainer}>No job details available.</div>;
  }

  return (
    <>
      <div className={`${styles.overlay} ${isFullScreen ? styles.showOverlay : ''}`} />
      <div className={`${styles.WholeContainer} ${isFullScreen ? styles.fullScreen : ''}`}>
        <div className={styles.scroller}>
          <div className={styles.expandIcon} onClick={toggleFullScreen}>
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </div>

          <h2 className={styles.Common}>Congrats! Are you ready to discover top talent?</h2>
          <p className={styles.tagline}>You can customize according to your own</p>
          {keywords && <p className={styles.keywords}>{keywords}</p>}
          <h4>Job Title</h4>
          <h2 className={styles.title}>{jobDetails.title}</h2>
          <h4 className={styles.description}>About the job </h4>
          <p>{jobDetails.description}</p>
          
          {jobDetails.requirements && (
            <>
              <h4>Requirements</h4>
              <ul>
                {jobDetails.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </>
          )}
          
          {jobDetails.responsibilities && (
            <>
              <h4>Key Responsibilities</h4>
              <ul>
                {jobDetails.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </>
          )}
          
          <div className={styles.details}>
            <p className={styles.jobDetails}>
              <strong>Job Type, Workplace, Location:</strong> 
            </p>
            <p>{jobDetails.type}, {jobDetails.workplace}, {jobDetails.location}</p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.candidate} onClick={handleFindCandidates}>
            Find Candidates
          </button>
          {isFullScreen && (
            <button className={styles.regenerate} onClick={onRegenerate}>
              <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.625 16.125H3.125M3.125 16.125C3.125 16.125 6.875 21.375 12.5 21.375C17.678 21.375 21.875 17.625 21.875 13.125M3.125 16.125V21.375M17.375 7.875H21.875M21.875 7.875C21.875 7.875 18.125 2.625 12.5 2.625C7.322 2.625 3.125 6.375 3.125 10.875M21.875 7.875V2.625" stroke="#C663FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Re-generate
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Scroller;