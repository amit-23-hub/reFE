import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileResumeSkills.module.css';
import SideMenu from '../../components/SideMenu/SideMenu';
import ProgressBar from './ProgressBar/ProgressBar';
import { FiEdit2 } from 'react-icons/fi';
import { getCandidateProfile, updateResumeSkills } from '../../services/candidateProfileService';

const ProfileResumeSkills = () => {
  const currentStep = 2;
  const [isMobile, setIsMobile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Add this to your state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const profile = await getCandidateProfile();
        if (profile.skills) {
          // Ensure we handle both string names and full skill objects
          setSkills(profile.skills.map(skill => 
            typeof skill === 'string' ? skill : skill.name
          ));
        }
        if (profile.resume) {
          setResumePreview({
            name: profile.resume.name || profile.resume.originalName,
            size: profile.resume.size ? 
              `${(profile.resume.size / 1024).toFixed(2)} KB` : 'N/A',
            url: profile.resume.url
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditMode(true);
  };
  const [error, setError] = useState(null); // Add this with your other state declarations



const handleSaveClick = async () => {
  try {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    
    const formData = new FormData();
    
    // Add resume file
    if (resume instanceof File) {
      formData.append('resume', resume, encodeURIComponent(resume.name));
    }

    // Prepare skills data
    skills.forEach((skill, index) => {
      formData.append(`skills[${index}][name]`, typeof skill === 'string' ? skill : skill.name);
      formData.append(`skills[${index}][level]`, typeof skill === 'string' ? 'Intermediate' : skill.level);
    });

    // Create config with progress tracking
    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
      timeout: 30000 // 30 second timeout
    };

    const response = await updateResumeSkills(formData, config);
    
    if (response.error) {
      throw new Error(response.error);
    }

    // Update local state if successful
    if (response.profile?.resume) {
      setResumePreview({
        name: response.profile.resume.name,
        size: `${(response.profile.resume.size / 1024).toFixed(2)} KB`,
        url: response.profile.resume.url
      });
    }

    setIsEditMode(false);
    navigate('/profile-steps/education');
  } catch (error) {
    console.error('Upload failed:', error);
    
    let errorMessage = 'Failed to upload resume. Please try again.';
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot connect to server. Please check your internet connection.';
    } else if (error.response) {
      errorMessage = error.response.data?.message || error.message;
    }
    
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
  

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file); // Store the File object directly
      setResumePreview({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.profileContainer}>
      {!isMobile && (
        <div className={styles.sideMenuContainer}>
          <SideMenu />
        </div>
      )}
      
      <div className={styles.profileContent}>
        <div className={styles.profileGrid}>
          <div className={styles.progressBarContainer}>
            <ProgressBar 
              currentStep={currentStep}
              isMobileExpanded={false}
              setIsMobileExpanded={() => {}}
            />
          </div>

          <div className={styles.profileDetailsContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.headerRow}>
                <h1>Resume & Skills</h1>
                {!isEditMode && (
                  <button 
                    className={styles.editIcon} 
                    onClick={handleEditClick}
                    disabled={isLoading}
                  >
                    <FiEdit2 />
                  </button>
                )}
              </div>
              <p>You can update your skills and upload your resume here.</p>
            </div>

            <div className={styles.profileDetails}>
              {/* Skills Section */}
              <div className={styles.skillsSection}>
                <h2>Skills *</h2>
                {isEditMode ? (
                  <>
                    <div className={styles.addSkillContainer}>
                      <input
                        type="text"
                        placeholder="Add a new skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={styles.skillInput}
                      />
                      <button 
                        onClick={handleAddSkill} 
                        className={styles.addSkillButton}
                        disabled={!newSkill.trim()}
                      >
                        Add
                      </button>
                    </div>
                    <div className={styles.skillsList}>
                      {skills.map((skill, index) => (
                        <div key={index} className={styles.skillItem}>
                          {skill}
                          <span
                            className={styles.removeSkill}
                            onClick={() => handleRemoveSkill(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.skillsList}>
                    {skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <div key={index} className={styles.skillItem}>
                          {skill}
                        </div>
                      ))
                    ) : (
                      <p>No skills added yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Resume Section */}
              <div className={styles.resumeSection}>
                <h2>Resume</h2>
                <div className={styles.resumeUpload}>
                  {resumePreview ? (
                    <div className={styles.resumeFile}>
                      <span className={styles.resumeName}>{resumePreview.name}</span>
                      <span className={styles.resumeSize}>{resumePreview.size}</span>
                      <a 
                        href={resumePreview.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <p>No resume uploaded.</p>
                  )}
                  {isEditMode && (
                    <div className={styles.fileInputContainer}>
                      <label className={styles.fileInputLabel}>
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeChange}
                          className={styles.resumeInput}
                        />
                      </label>
                      {resumePreview && (
                        <span className={styles.fileName}>{resumePreview.name}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className={styles.actionButtons}>
                <button 
                  className={styles.cancelButton} 
                  onClick={() => setIsEditMode(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSaveClick}
                  disabled={isLoading || skills.length === 0}
                >
                  {isLoading ? 'Saving...' : 'Save & Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileResumeSkills;