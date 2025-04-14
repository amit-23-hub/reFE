import axios from 'axios';

const API_URL = 'https://re-be.onrender.com/api/candidate';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

// Get full profile
export const getCandidateProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update basic info
export const updateBasicInfo = async (data) => {
  try {
    // Stringify nested objects to ensure proper JSON formatting
    const requestData = {
      ...data,
      currentLocation: JSON.stringify(data.currentLocation)
    };

    const response = await axios.put(
      `${API_URL}/basic-info`,
      requestData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating basic info:', error);
    throw error;
  }
};

// Update profile image
// In services/candidateProfileService.js
export const updateProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await axios.put(
      `${API_URL}/profile-image`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Let browser set Content-Type with boundary
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    
    console.log('Profile image update response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating profile image:', {
      error: error.response?.data || error.message,
      file: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    });
    throw error.response?.data || error.message;
  }
};

// Update resume and skills
export const updateResumeSkills = async (formData, config = {}) => {
  try {
    const response = await axios.put(
      `${API_URL}/resume-skills`,
      formData,
      {
        ...getAuthHeader(true),
        ...config,
        headers: {
          ...getAuthHeader(true).headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw {
        ...error,
        message: error.response.data?.message || 'Server responded with an error'
      };
    } else if (error.request) {
      // The request was made but no response was received
      throw {
        ...error,
        message: 'No response from server. Please try again later.'
      };
    } else {
      // Something happened in setting up the request
      throw {
        ...error,
        message: 'Request failed to setup. Please check your connection.'
      };
    }
  }
};
// Update education - Modified to properly stringify the education array
export const updateEducation = async (education) => {
  try {
    const response = await axios.put(
      `${API_URL}/education`,
      { education: JSON.stringify(education) }, // Stringify the education array
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error.response?.data || error.message;
  }
};


// Update identity verification
export const updateIdentityVerification = async (formData, onUploadProgress) => {
  try {
    const response = await axios.put(
      `${API_URL}/identity-verification`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        onUploadProgress
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in identity verification:', error);
    throw error.response?.data || error.message;
  }
};

// Update social links
export const updateSocialLinks = async (socialLinks) => {
  try {
    const response = await axios.put(
      `${API_URL}/social-links`,
      socialLinks,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};