import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signIn } from '../services/cognito';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await signIn(email, password);
      // Store the token in localStorage or your preferred state management
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      navigate('/'); // Navigate to home page after successful login
    } catch (error: any) {
      if (error.name === 'UserNotConfirmedException') {
        toast.error('Please verify your email first');
        navigate('/signup');
      } else if (error.name === 'NotAuthorizedException') {
        toast.error('Incorrect email or password');
      } else {
        toast.error(error.message || 'Login failed');
      }
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login; 