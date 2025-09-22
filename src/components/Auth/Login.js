import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Check for hardcoded admin credentials
      const ADMIN_EMAIL = "admin@careeradvisor.com";
      const ADMIN_PASSWORD = "admin123";
      
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Create/login admin user
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authError) {
          // If admin account doesn't exist, create it
          if (authError.code === 'auth/user-not-found') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Set admin role in Firestore
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              name: "System Administrator",
              email: email,
              role: "admin",
              createdAt: new Date(),
            });
          } else {
            throw authError;
          }
        }
        
        // Ensure admin role is set in Firestore
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: "System Administrator",
            email: email,
            role: "admin",
            createdAt: new Date(),
          }, { merge: true });
        }
        
        navigate('/admin');
        return;
      }
      
      // Regular user login
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to dashboard after login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('login')}
          </button>
        </form>
        <div className="text-sm text-center">
          <p className="font-medium text-indigo-600 hover:text-indigo-500">
            Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-500">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
