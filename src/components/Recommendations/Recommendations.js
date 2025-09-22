import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import degreesData from '../../data/degrees.json';
import collegesData from '../../data/colleges.json';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

function Recommendations() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedDegrees, setRecommendedDegrees] = useState([]);
  const [recommendedColleges, setRecommendedColleges] = useState([]);
  const [allDegrees, setAllDegrees] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [showRecommended, setShowRecommended] = useState(true);
  const [hasQuizResults, setHasQuizResults] = useState(false);

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

          // Try to fetch quiz results from Firestore
          try {
            const quizDocRef = doc(db, "quizResults", auth.currentUser.uid);
            const quizDocSnap = await getDoc(quizDocRef);
            if (quizDocSnap.exists()) {
              setQuizResults(quizDocSnap.data().scores);
              setHasQuizResults(true);
            } else {
              // Use mock data if no quiz results found
              const mockQuizResults = { Science: 40, Arts: 25, Commerce: 30 };
              setQuizResults(mockQuizResults);
              setHasQuizResults(false);
            }
          } catch (quizError) {
            console.log('No quiz results found, using mock data');
            const mockQuizResults = { Science: 40, Arts: 25, Commerce: 30 };
            setQuizResults(mockQuizResults);
            setHasQuizResults(false);
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
        
        // Set all degrees and colleges for "All" view
        setAllDegrees(degreesData);
        setAllColleges(collegesData);
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

  const currentDegrees = showRecommended ? recommendedDegrees : allDegrees;
  const currentColleges = showRecommended ? recommendedColleges : allColleges;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{t('recommendations')}</h2>
          
          {/* Filter Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowRecommended(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showRecommended
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recommended {hasQuizResults ? '(Based on Quiz)' : '(Sample)'}
            </button>
            <button
              onClick={() => setShowRecommended(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showRecommended
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Options
            </button>
          </div>

        {/* Charts: Stream distribution and Degree alignment */}
        {quizResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream distribution (Pie) */}
            <div className="p-4 border rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Stream Distribution</h4>
              <Pie
                data={{
                  labels: Object.keys(quizResults),
                  datasets: [
                    {
                      label: 'Score',
                      data: Object.values(quizResults),
                      backgroundColor: ['#6366f1', '#22c55e', '#f97316'],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{ plugins: { legend: { position: 'bottom' } } }}
              />
            </div>

            {/* Degree count by stream (Bar) */}
            <div className="p-4 border rounded-lg lg:col-span-2">
              <h4 className="text-lg font-semibold mb-2">Degree Options by Stream</h4>
              <Bar
                data={{
                  labels: ['Science', 'Arts', 'Commerce'],
                  datasets: [
                    {
                      label: 'Recommended Degrees',
                      data: [
                        (recommendedDegrees || []).filter(d => d.streams.includes('Science')).length,
                        (recommendedDegrees || []).filter(d => d.streams.includes('Arts')).length,
                        (recommendedDegrees || []).filter(d => d.streams.includes('Commerce')).length,
                      ],
                      backgroundColor: '#6366f1',
                    },
                    {
                      label: 'All Degrees',
                      data: [
                        (allDegrees || []).filter(d => d.streams.includes('Science')).length,
                        (allDegrees || []).filter(d => d.streams.includes('Arts')).length,
                        (allDegrees || []).filter(d => d.streams.includes('Commerce')).length,
                      ],
                      backgroundColor: '#c7d2fe',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                }}
              />
            </div>
          </div>
        )}
        </div>
        
        {!hasQuizResults && showRecommended && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Sample Recommendations
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>These are sample recommendations. Take the quiz to get personalized suggestions based on your interests and aptitude.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDegrees.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mt-6 mb-4">
              {showRecommended ? 'Recommended Degrees' : 'All Available Degrees'}
              <span className="text-lg text-gray-500 ml-2">({currentDegrees.length} options)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDegrees.map((degree) => (
                <div key={degree.id} className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-bold mb-3 text-indigo-600">{degree.name}</h4>
                  <p className="text-gray-700 mb-3">{degree.description}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Streams:</p>
                      <p className="text-sm text-gray-800">{degree.streams.join(', ')}</p>
                    </div>
                    {degree.job_roles && degree.job_roles.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Career Options:</p>
                        <p className="text-sm text-gray-800">{degree.job_roles.map(job => job.name).join(', ')}</p>
                      </div>
                    )}
                    {degree.relevant_exams && degree.relevant_exams.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Relevant Exams:</p>
                        <p className="text-sm text-gray-800">{degree.relevant_exams.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentColleges.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mt-6 mb-4">
              {showRecommended ? 'Recommended Colleges' : 'All Available Colleges'}
              <span className="text-lg text-gray-500 ml-2">({currentColleges.length} options)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentColleges.map((college) => (
                <div key={college.id} className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-bold mb-3 text-green-600">{college.name}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location:</p>
                      <p className="text-sm text-gray-800">{college.location.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available Courses:</p>
                      <p className="text-sm text-gray-800">{college.courses.join(', ')}</p>
                    </div>
                    {college.type && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Type:</p>
                        <p className="text-sm text-gray-800 capitalize">{college.type}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentDegrees.length === 0 && currentColleges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Options Available</h3>
            <p className="text-gray-600">No {showRecommended ? 'recommendations' : 'options'} available at the moment.</p>
            {showRecommended && (
              <p className="text-gray-600 mt-2">Complete the quiz and update your profile to get personalized recommendations!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
