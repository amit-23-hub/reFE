import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileIdentityVerification.module.css';
import SideMenu from '../../components/SideMenu/SideMenu';
import ProgressBar from './ProgressBar/ProgressBar';
import { getCandidateProfile, updateIdentityVerification } from '../../services/candidateProfileService';

const ProfileIdentityVerification = () => {
  const currentStep = 4;
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    proofType: '',
    fullAddress: '',
    verificationConsent: false,
    verificationStatus: 'Pending'
  });
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setUploadProgress(0);
      
      const formDataToSend = new FormData();
      formDataToSend.append('proofType', formData.proofType);
      formDataToSend.append('fullAddress', formData.fullAddress);
      formDataToSend.append('verificationConsent', formData.verificationConsent.toString());

      const currentDoc = uploadedDocuments[formData.proofType];
      if (currentDoc) {
        if (currentDoc.isNew && currentDoc.file) {
          formDataToSend.append('file', currentDoc.file);
        } else if (currentDoc.url && currentDoc.publicId) {
          formDataToSend.append('existingDocument', JSON.stringify({
            url: currentDoc.url,
            publicId: currentDoc.publicId
          }));
        }
      }

      const response = await updateIdentityVerification(formDataToSend, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      // Update the local state with the response data if needed
      if (response.proofDocument) {
        setUploadedDocuments(prev => ({
          ...prev,
          [formData.proofType]: {
            url: response.proofDocument.url,
            publicId: response.proofDocument.publicId,
            name: response.proofDocument.originalName || response.proofDocument.name,
            size: response.proofDocument.size || 0,
            type: response.proofDocument.mimeType,
            isNew: false
          }
        }));
      }

      navigate('/profile-steps/social-links');
    } catch (error) {
      console.error('Error updating verification:', error);
      setError(error.message || 'Failed to submit verification');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const profile = await getCandidateProfile();
        if (profile.identityVerification) {
          setFormData({
            proofType: profile.identityVerification.proofType || '',
            fullAddress: profile.identityVerification.fullAddress || '',
            verificationConsent: profile.identityVerification.verificationConsent || false,
            verificationStatus: profile.identityVerification.verificationStatus || 'Pending'
          });
          
          if (profile.identityVerification?.proofDocument) {
            setUploadedDocuments({
              [profile.identityVerification.proofType]: {
                url: profile.identityVerification.proofDocument.url,
                publicId: profile.identityVerification.proofDocument.publicId,
                name: profile.identityVerification.proofDocument.originalName || 
                      profile.identityVerification.proofDocument.name,
                size: profile.identityVerification.proofDocument.size || 0,
                type: profile.identityVerification.proofDocument?.mimeType || 
                     (profile.identityVerification.proofDocument?.url?.includes('.pdf') ? 
                      'application/pdf' : 'image/jpeg'),
                isNew: false
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching verification details:', error);
        setError('Failed to load verification details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or PDF file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    
    let previewUrl = '';
    if (file.type.includes('image')) {
      previewUrl = URL.createObjectURL(file);
    } else {
      previewUrl = '/pdf-icon.png';
    }
    
    setUploadedDocuments({
      [docType]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        isNew: true
      }
    });
    setError(null);
  };

  const handleRemoveDocument = (docType) => {
    const newDocuments = { ...uploadedDocuments };
    delete newDocuments[docType];
    setUploadedDocuments(newDocuments);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
              <h1>Identity Verification</h1>
              <p>Verify your identity to complete your profile</p>
              
              {formData.verificationStatus !== 'Pending' && (
                <div className={`${styles.statusBadge} ${
                  formData.verificationStatus === 'Verified' ? styles.verified : styles.rejected
                }`}>
                  Status: {formData.verificationStatus}
                </div>
              )}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.profileDetails}>
              <div className={styles.verificationForm}>
                <div className={styles.formGroup}>
                  <label>Select Document Type *</label>
                  <select
                    name="proofType"
                    value={formData.proofType}
                    onChange={handleInputChange}
                    className={styles.proofSelect}
                    disabled={formData.verificationStatus === 'Verified'}
                  >
                    <option value="">Select type</option>
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                  </select>
                </div>

                {formData.proofType && !uploadedDocuments[formData.proofType] && (
                  <div className={styles.formGroup}>
                    <label>Upload {formData.proofType} *</label>
                    <div className={styles.fileUploadContainer}>
                      <input
                        type="file"
                        id="identityDocument"
                        className={styles.fileInput}
                        onChange={(e) => handleFileUpload(e, formData.proofType)}
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: 'none' }}
                        disabled={formData.verificationStatus === 'Verified'}
                      />
                      <label htmlFor="identityDocument" className={styles.uploadButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 15V3H13V15H11Z" fill="currentColor"/>
                          <path d="M5.793 8.793L7.207 7.379L12 12.172L16.793 7.379L18.207 8.793L12 15L5.793 8.793Z" fill="currentColor"/>
                          <path d="M18 15V17H6V15H4V17C4 18.103 4.897 19 6 19H18C19.103 19 20 18.103 20 17V15H18Z" fill="currentColor"/>
                        </svg>
                        Upload Document
                      </label>
                      <p className={styles.fileHint}>Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                )}

                {uploadedDocuments[formData.proofType] && (
                  <div className={styles.documentPreview}>
                    <div className={styles.documentInfo}>
                      <span className={styles.documentType}>{formData.proofType}</span>
                      <span className={styles.documentName}>
                        {uploadedDocuments[formData.proofType].name}
                      </span>
                      <span className={styles.documentSize}>
                        {(uploadedDocuments[formData.proofType].size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div className={styles.documentActions}>
                      <a 
                        href={uploadedDocuments[formData.proofType].url || uploadedDocuments[formData.proofType].previewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View
                      </a>
                      <button 
                        onClick={() => handleRemoveDocument(formData.proofType)}
                        className={styles.removeButton}
                        disabled={formData.verificationStatus === 'Verified'}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Full Address *</label>
                  <textarea
                    name="fullAddress"
                    placeholder="Enter your complete address as shown on your document"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    className={styles.addressInput}
                    disabled={formData.verificationStatus === 'Verified'}
                    rows={4}
                  />
                </div>

                <div className={styles.consentSection}>
                  <label className={styles.consentLabel}>
                    <input
                      type="checkbox"
                      name="verificationConsent"
                      checked={formData.verificationConsent}
                      onChange={handleInputChange}
                      disabled={formData.verificationStatus === 'Verified'}
                    />
                    <span>
                      I authorize RecruIT to verify my identity and understand this is required
                      to complete my profile verification. *
                    </span>
                  </label>
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className={styles.uploadProgress}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
              )}

              {formData.verificationStatus !== 'Verified' && (
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.cancelButton} 
                    onClick={() => navigate('/profile')}
                    disabled={isLoading}
                  >
                    cancel
                  </button>
                  <button 
                    className={styles.verifyButton} 
                    onClick={handleVerify}
                    disabled={
                      isLoading || 
                      !formData.proofType || 
                      !uploadedDocuments[formData.proofType] || 
                      !formData.fullAddress || 
                      !formData.verificationConsent
                    }
                  >
                    {isLoading ? 'Submitting...' : ' Verify' }
                  </button>
                </div>
              )}

              {formData.verificationStatus === 'Verified' && (
                <div className={styles.completedMessage}>
                  <p>Your identity verification has been completed successfully.</p>
                  <button 
                    className={styles.continueButton}
                    onClick={() => navigate('/profile-steps/social-links')}
                  >
                    Continue to Next Step
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileIdentityVerification;