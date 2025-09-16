import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form fields for editing
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [sClass, setSClass] = useState('');
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            setName(data.name);
            setAge(data.age);
            setGender(data.gender);
            setSClass(data.class);
            setLocation(data.location);
            setPreferences(data.preferences);
          } else {
            setError("No such document!");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("No user logged in.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          name,
          age: parseInt(age),
          gender,
          class: sClass,
          location,
          preferences,
        });
        setUserProfile({
          ...userProfile,
          name,
          age: parseInt(age),
          gender,
          class: sClass,
          location,
          preferences,
        });
        setIsEditing(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center py-10">No profile data available. Please register.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t('profile')}</h2>

        {!isEditing ? (
          <div>
            <p><strong>{t('name')}:</strong> {userProfile.name}</p>
            <p><strong>{t('age')}:</strong> {userProfile.age}</p>
            <p><strong>{t('gender')}:</strong> {userProfile.gender}</p>
            <p><strong>{t('class')}:</strong> {userProfile.class}</p>
            <p><strong>{t('location')}:</strong> {userProfile.location}</p>
            <p><strong>{t('preferences')}:</strong> {userProfile.preferences}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleUpdateProfile}>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t('age')}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">{t('gender')}</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sClass}
              onChange={(e) => setSClass(e.target.value)}
            >
              <option value="">{t('class')}</option>
              <option value="10">10</option>
              <option value="12">12</option>
            </select>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t('location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`${t('preferences')} (e.g., Science, Arts)`}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
