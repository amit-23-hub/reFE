import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import SideMenu from '../../components/SideMenu/SideMenu';
import ProfileHeader from '../../components/PhoneCandidateProfile/ProfileHeader';
import ProfileRight from '../../components/PhoneCandidateProfile/ProfileRight';
import ShortBio from '../../components/PhoneCandidateProfile/ShortBio';
import SkillsAndPreferences from '../../components/PhoneCandidateProfile/SkillsAndPreferences';
import { getCandidateProfile } from '../../services/candidateProfileService';

const Profile = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getCandidateProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!profile) {
    return <div className={styles.error}>No profile data found</div>;
  }

  // Format the data for your components
  const profileHeaderData = {
    name: profile.fullName || 'No name provided',
    title: profile.basicInfo?.title || 'No title provided',
    location: profile.basicInfo?.currentLocation 
      ? `${profile.basicInfo.currentLocation.city}, ${profile.basicInfo.currentLocation.state}`
      : 'Location not specified',
    completionPercentage: profile.completionPercentage || 0,
    profileImage: profile.profileImage || '/default-profile.png'
  };

  const shortBioData = profile.basicInfo?.bio || 'No bio provided yet';

  const skillsData = profile.skills || [];
  const jobPreferencesData = {
    location: profile.basicInfo?.currentLocation?.city || 'Anywhere',
    availability: profile.basicInfo?.availability || 'Not specified',
    jobType: 'Full-time' // Static as it's not in your schema
  };
  

  const profileRightData = {
    resume: profile.resume 
      ? { 
          name: profile.resume.name || 'Resume.pdf',
          url: profile.resume.url,
          size: profile.resume.size 
            ? `${Math.round(profile.resume.size / 1024)} KB` 
            : 'Unknown size'
        }
      : null,
    education: profile.education || [],
    verificationStatus: profile.identityVerification?.verificationStatus || 'Not verified'
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.hamburgerMenu} onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`${styles.sideMenuWrapper} ${isSideMenuOpen ? styles.showSideMenu : ''}`}>
        <SideMenu />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h4>Welcome back, {profile.fullName || 'User'}!</h4>
        </div>
        
        <ProfileHeader profileData={profileHeaderData} />
        
        <ShortBio bio={shortBioData} />
        
        <div className={styles.mobileProfileRight}>
          <ProfileRight 
            resume={profileRightData.resume}
            education={profileRightData.education}
            verificationStatus={profileRightData.verificationStatus}
          />
        </div>
        
        <SkillsAndPreferences 
          skills={skillsData} 
          jobPreferences={jobPreferencesData} 
        />
      </div>
      
      <div className={styles.desktopProfileRight}>
        <ProfileRight 
          resume={profileRightData.resume}
          education={profileRightData.education}
          verificationStatus={profileRightData.verificationStatus}
        />
      </div>
    </div>
  );
};

export default Profile;