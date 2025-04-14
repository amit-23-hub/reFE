import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEducationCertification.module.css';
import SideMenu from '../../components/SideMenu/SideMenu';
import ProgressBar from './ProgressBar/ProgressBar';
import { getCandidateProfile, updateEducation } from '../../services/candidateProfileService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProfileEducationCertification = () => {
  const currentStep = 3;
  const [isMobile, setIsMobile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [educationDetails, setEducationDetails] = useState([]);
  const [newEducation, setNewEducation] = useState({
    schoolName: '',
    degreeType: '',
    startDate: null,
    endDate: null,
    current: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const profile = await getCandidateProfile();
        if (profile.education) {
          setEducationDetails(profile.education.map(edu => ({
            ...edu,
            id: edu._id || Date.now(),
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate && edu.endDate !== 'Present' ? new Date(edu.endDate) : null,
            current: edu.endDate === 'Present'
          })));
        }
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      await updateEducation(educationDetails);
      setIsEditMode(false);
      navigate('/profile-steps/verification');
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Failed to save education. Please check all fields and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new state for tracking edited education
  const [editingEducation, setEditingEducation] = useState(null);

  // Modify handleEditClick to only allow adding new education
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Modify handleAddEducation
  const handleAddEducation = () => {
    if (
      newEducation.schoolName.trim() !== '' &&
      newEducation.degreeType.trim() !== '' &&
      newEducation.startDate !== null
    ) {
      const newEdu = {
        ...newEducation,
        id: Date.now(),
        endDate: newEducation.current ? 'Present' : newEducation.endDate
      };
      setEducationDetails([...educationDetails, newEdu]);
      setNewEducation({
        schoolName: '',
        degreeType: '',
        startDate: null,
        endDate: null,
        current: false
      });
    }
  };

  const handleRemoveEducation = (id) => {
    setEducationDetails(educationDetails.filter(edu => edu.id !== id));
  };

  const handleEducationChange = (id, field, value) => {
    setEducationDetails(educationDetails.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleCurrentCheckboxChange = (e) => {
    setNewEducation({
      ...newEducation,
      current: e.target.checked,
      endDate: e.target.checked ? null : newEducation.endDate
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (date === 'Present') return date;
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
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
                <h1>Education & Certifications</h1>
                {!isEditMode && (
                  <button
                    className={styles.editButton}
                    onClick={handleEditClick}
                    disabled={isLoading}
                  >
                    Add
                  </button>
                )}
              </div>
              <p>You can update your all education and certification courses here.</p>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.educationSection}>
                <h2>Educational Background *</h2>

                {educationDetails.map((edu) => (
  <div key={edu.id} className={styles.educationItem}>
    <div className={styles.educationSquare}></div>
    <div className={styles.educationInfo}>
      <h3>{edu.schoolName}</h3>
      <p>{edu.degreeType}</p>
      <p>
        {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
      </p>
    </div>
  </div>
))}

                {isEditMode && (
                  <div className={styles.addEducationSection}>
                    <div className={styles.addEducationForm}>
                      <input
                        type="text"
                        value={newEducation.schoolName}
                        onChange={(e) => setNewEducation({...newEducation, schoolName: e.target.value})}
                        placeholder="School/University Name"
                      />
                      <input
                        type="text"
                        value={newEducation.degreeType}
                        onChange={(e) => setNewEducation({...newEducation, degreeType: e.target.value})}
                        placeholder="Degree"
                      />
                      <div className={styles.dateRow}>
                        <DatePicker
                          selected={newEducation.startDate}
                          onChange={(date) => setNewEducation({...newEducation, startDate: date})}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Start Year"
                          className={styles.dateInput}
                          maxDate={new Date()}
                        />
                        <DatePicker
                          selected={newEducation.current ? null : newEducation.endDate}
                          onChange={(date) => setNewEducation({...newEducation, endDate: date})}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="End Year"
                          className={styles.dateInput}
                          minDate={newEducation.startDate}
                          maxDate={new Date()}
                          disabled={newEducation.current}
                        />
                      </div>
                      {/* <div className={styles.currentCheckbox}>
                        <input
                          type="checkbox"
                          id="current-education"
                          checked={newEducation.current}
                          onChange={handleCurrentCheckboxChange}
                        />
                        <label htmlFor="current-education">I currently attend here</label>
                      </div> */}
                      <button
                        onClick={handleAddEducation}
                        className={styles.addButton}
                        disabled={
                          !newEducation.schoolName.trim() ||
                          !newEducation.degreeType.trim() ||
                          !newEducation.startDate
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
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
                  disabled={isLoading || educationDetails.length === 0}
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

export default ProfileEducationCertification;