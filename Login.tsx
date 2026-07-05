import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Direct integration pipeline to your real authentication backend endpoints
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Test User Account",
          email,
          password,
          role: "HR Manager", // Default testing flag parameters
          department: "Operations Strategy"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid system access token configuration.');
      }

      // Commit to global context state provider memory
      loginSession(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        employeeId: data.user.employeeId
      });

    // Reroute based on structural clearance configurations
      if (data.user.role === 'Employee') {
        navigate('/employee');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
