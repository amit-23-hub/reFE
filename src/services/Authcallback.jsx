import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      try {
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Decode token to get user information
        const decodedToken = jwtDecode(token);
        
        // Determine user type - check both possible fields
        const userType = decodedToken.role || decodedToken.userType;
        
        if (!userType) {
          throw new Error('User type not found in token');
        }

        // Store userType in localStorage
        localStorage.setItem('userType', userType);

        // Redirect based on user type
        if (userType === 'candidate') {
          navigate('/profile');
        } else if (userType === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          // Fallback for unknown user types
          console.error('Unknown user type:', userType);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error processing authentication:', error);
        // Clear any partial authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      Processing login...
    </div>
  );
};

export default AuthCallback;