import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { signUp, verifyEmail, resendVerificationCode } from '../services/cognito';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setShowVerification(true);
      toast.info('Please check your email for verification code');
    } catch (error: any) {
      if (error.name === 'UsernameExistsException') {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error(error.message || 'Signup failed');
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(email, verificationCode);
      toast.success('Email verified successfully! You can now login.');
      navigate('/signin');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email);
      toast.info('New verification code sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    }
  };

  return (
    <div>
      {!showVerification ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small>
            Password must be at least 8 characters long and contain:
            <ul>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@$!%*?&)</li>
            </ul>
          </small>
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <p>Please enter the verification code sent to your email</p>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type="submit">Verify Email</button>
          <button type="button" onClick={handleResendCode}>
            Resend Code
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;