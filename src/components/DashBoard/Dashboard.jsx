import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SideMenu from "../SideMenu/SideMenu";
import DashBoardHeader from "../DashboardHeader/DashboardHeader.jsx";
import JobDescriptionForm from "./JobDiscriptionForm/JobDiscriptionForm";
import JobList from "./JobList/JobList.jsx";
import Scroller from "./Scroller/Scroller.jsx";
import CandidateFinder from "./CandidateFinder/CandidateFinder.jsx";
import styles from "./Dashboard.module.css";
import Top from "./TopSec/Top.jsx";
import img from '../../assets/HomeImg.png';  // Make sure this image exists
import dummyData from '../../data/dummyData.json';

const Dashboard = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [topCandidates, setTopCandidates] = useState([]);
  const [isScrollerVisible, setIsScrollerVisible] = useState(false);
  const [showJobInfo, setShowJobInfo] = useState(false);  // Add this state

  const handleInputChange = (value) => {
    setInputValue(value);
    setShowCandidates(false);
  };

  const handleGenerateJD = (jobData) => {
    if (jobData) {
      const formattedJobDetails = {
        title: jobData.job_title,
        description: jobData.about_the_role,
        type: jobData.job_type_workplace_location.split(',')[0],
        workplace: jobData.job_type_workplace_location.split(',')[1],
        location: jobData.job_type_workplace_location.split(',')[2],
        requirements: jobData.requirements,
        responsibilities: jobData.key_responsibilities,
        tags: jobData.tags
      };
      
      setJobDetails(formattedJobDetails);
      setIsScrollerVisible(true);
      setShowJobInfo(true);
    }
  };

  const handleFindCandidates = async () => {
    if (!jobDetails) return;

    try {
      // Send the complete job description as input
      const requestBody = {
        jd_json: jobDetails.description
      };

      console.log('Sending request with body:', requestBody);

      const response = await fetch('http://20.193.128.47:8010/match-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch candidates: ${response.status}`);
      }

      const rawData = await response.json();
      // Transform the API response to match the expected format
      const fetchedCandidates = rawData.matches.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        role: candidate.title,
        description: candidate.summary,
        location: candidate.location,
        education: candidate.education,
        experience: `${candidate.yearsExperience} years`,
        noticePeriod: candidate.availability,
        matchPercentage: Math.round(candidate.matchScore),
        matches: 5, // Default value or can be calculated
        interviewing: 2, // Default value or can be calculated
        skills: candidate.matchingDetails.Skills || [],
        whatMatched: candidate.whatMatched,
        matchingDetails: candidate.matchingDetails
      }));

      setTopCandidates(fetchedCandidates);
      navigate('/findcandidate', { 
        state: { 
          jobDetails, 
          candidates: fetchedCandidates, 
          keywords: inputValue 
        } 
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // You might want to add error handling UI feedback here
    }
  };

  return (
    <div className={styles.dashboard}>
      <SideMenu />
      <div className={styles.mainContent}>
        <div className={styles.mobileTop}>
          <Top />
        </div>
        <DashBoardHeader />
        <div className={styles.middle}>
          <div className={styles.formAndList}>
            <div className={styles.desktopTop}>
              <Top />
            </div>
            <JobDescriptionForm 
              onInputChange={handleInputChange} 
              onGenerateJD={handleGenerateJD}
              isScrollerVisible={isScrollerVisible}
            />
            {showJobInfo && (
              <div className={styles.jobInfo}>
                <p className={styles.salaryInfo}>
                  <span role="img" aria-label="money">💰</span> 25-35LPA: Market salary range of 5 years experience
                </p>
                <p className={styles.workSystemInfo}>
                  <span role="img" aria-label="building">🏢</span> 70% companies are offering hybrid system for this role
                </p>
              </div>
            )}
            {!isScrollerVisible && <JobList />}
          </div>
          {isScrollerVisible && jobDetails && (
            <div className={styles.scrollerContainer}>
              <Scroller
                jobDetails={jobDetails}
                keywords={inputValue}
                onFindCandidates={handleFindCandidates}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;