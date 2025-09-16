import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-bold">{t('dashboard')}</Link>
        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
        <Link to="/quiz" className="hover:text-gray-300">{t('quiz')}</Link>
        <Link to="/recommendations" className="hover:text-gray-300">{t('recommendations')}</Link>
        <Link to="/colleges" className="hover:text-gray-300">{t('colleges')}</Link>
        <Link to="/careers" className="hover:text-gray-300">{t('careers')}</Link>
        <Link to="/parent-portal" className="hover:text-gray-300">{t('parent_portal')}</Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="language-selector">
          <button onClick={() => changeLanguage('en')} className="mr-2 hover:text-gray-300">English</button>
          <button onClick={() => changeLanguage('hi')} className="hover:text-gray-300">हिन्दी</button>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">{t('logout')}</button>
      </div>
    </nav>
  );
}

export default Navbar;
