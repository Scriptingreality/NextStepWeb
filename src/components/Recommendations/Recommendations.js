import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import degreesData from '../../data/degrees.json';
import collegesData from '../../data/colleges.json';

function Recommendations() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedDegrees, setRecommendedDegrees] = useState([]);
  const [recommendedColleges, setRecommendedColleges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          // Fetch user profile
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            setError("User profile not found.");
            setLoading(false);
            return;
          }

          // For MVP, quiz results are not saved to Firestore yet. Assuming a placeholder or fetching from local storage.
          // In a full implementation, you'd fetch quiz results from Firestore.
          const mockQuizResults = { Science: 40, Arts: 25, Commerce: 30 }; // Placeholder
          setQuizResults(mockQuizResults);

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

    fetchData();
  }, []);

  useEffect(() => {
    if (userProfile && quizResults) {
      // Simple rule-based recommendation logic
      const recommend = () => {
        let streamRecommendation = '';
        let maxScore = 0;
        for (const stream in quizResults) {
          if (quizResults[stream] > maxScore) {
            maxScore = quizResults[stream];
            streamRecommendation = stream;
          }
        }

        const filteredDegrees = degreesData.filter(degree =>
          degree.streams.includes(streamRecommendation)
        );

        // Further filter by user preferences if available
        let finalDegrees = filteredDegrees;
        if (userProfile.preferences) {
          const preferredStreams = userProfile.preferences.split(',').map(p => p.trim());
          finalDegrees = filteredDegrees.filter(degree =>
            degree.streams.some(s => preferredStreams.includes(s))
          );
        }

        setRecommendedDegrees(finalDegrees);

        // Recommend colleges based on recommended degrees and location
        const collegeRecommendations = collegesData.filter(college =>
          finalDegrees.some(degree =>
            college.courses.some(course =>
              degree.name.includes(course.split(' ')[0]) || degree.name.includes(course) // Simple matching
            )
          ) && (userProfile.location ? college.location.address.includes(userProfile.location) : true)
        );

        setRecommendedColleges(collegeRecommendations);
      };

      recommend();
    }
  }, [userProfile, quizResults]);

  if (loading) {
    return <div className="text-center py-10">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t('recommendations')}</h2>

        {recommendedDegrees.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mt-6 mb-4">Recommended Degrees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedDegrees.map((degree) => (
                <div key={degree.id} className="border p-4 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2">{degree.name}</h4>
                  <p className="text-gray-700">{degree.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Streams: {degree.streams.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedColleges.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mt-6 mb-4">Recommended Colleges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedColleges.map((college) => (
                <div key={college.id} className="border p-4 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2">{college.name}</h4>
                  <p className="text-gray-700">{college.location.address}</p>
                  <p className="text-sm text-gray-500 mt-2">Courses: {college.courses.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedDegrees.length === 0 && recommendedColleges.length === 0 && (
          <p className="text-center text-gray-600">No recommendations available yet. Complete the quiz and update your profile!</p>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
