// LoginRegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';

const LoginRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email, password });
      setMessage(response.data.message);
      // Redirect to user profile page or perform other actions upon successful login
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/register', { email, password });
      setMessage(response.data.message);
      // Redirect to login page or perform other actions upon successful registration
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Login/Register Page</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginRegisterPage;
