import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import degreesData from '../../data/degrees.json';
import collegesData from '../../data/colleges.json';

function AlternativePaths() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [alternativePaths, setAlternativePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAspiration, setSelectedAspiration] = useState('');

  const commonAspirations = [
    'Doctor', 'Engineer', 'Teacher', 'Lawyer', 'Business Owner', 
    'Artist', 'Scientist', 'Government Officer', 'Journalist', 'Architect'
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        // Fetch user profile
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
        }

        // Fetch quiz results
        const quizDocRef = doc(db, "quizResults", auth.currentUser.uid);
        const quizDocSnap = await getDoc(quizDocRef);
        if (quizDocSnap.exists()) {
          setQuizResults(quizDocSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const generateAlternativePaths = (aspiration) => {
    const alternatives = [];
    
    // Define alternative paths based on common aspirations
    const pathMappings = {
      'Doctor': [
        {
          title: 'Medical Laboratory Technician',
          description: 'Work in diagnostic labs, shorter study duration',
          requirements: 'Diploma in Medical Lab Technology',
          pros: ['2-year course', 'Good job opportunities', 'Healthcare sector'],
          cons: ['Lower salary than doctor', 'Limited career growth'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('Diploma')))
        },
        {
          title: 'Physiotherapist',
          description: 'Help patients recover through physical therapy',
          requirements: 'Bachelor in Physiotherapy (BPT)',
          pros: ['4-year course vs 5.5 years MBBS', 'Growing demand', 'Can start private practice'],
          cons: ['Physical demanding work', 'Less prestige than doctor'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('B.Sc')))
        },
        {
          title: 'Pharmacist',
          description: 'Medicine expert, drug dispensing and counseling',
          requirements: 'Bachelor of Pharmacy (B.Pharm)',
          pros: ['4-year course', 'Stable career', 'Can open pharmacy'],
          cons: ['Regulatory compliance stress', 'Competition from online pharmacies'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('B.Sc')))
        }
      ],
      'Engineer': [
        {
          title: 'Diploma Engineer',
          description: 'Technical roles with shorter study period',
          requirements: 'Diploma in Engineering (3 years)',
          pros: ['Shorter duration', 'Practical focused', 'Good job market'],
          cons: ['Lower salary than B.Tech', 'Limited research opportunities'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('Diploma')))
        },
        {
          title: 'Computer Applications Specialist',
          description: 'Software development and IT solutions',
          requirements: 'BCA or B.Sc Computer Science',
          pros: ['High demand', 'Remote work options', 'Good salary potential'],
          cons: ['Continuous learning required', 'High competition'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('B.Sc')))
        }
      ],
      'Teacher': [
        {
          title: 'Corporate Trainer',
          description: 'Train employees in companies',
          requirements: 'Any graduation + Training certification',
          pros: ['Higher salary than school teacher', 'Corporate environment', 'Travel opportunities'],
          cons: ['Job instability', 'Pressure to deliver results'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('B.A')))
        },
        {
          title: 'Content Creator/YouTuber',
          description: 'Create educational content online',
          requirements: 'Subject expertise + Digital skills',
          pros: ['Work from home', 'Unlimited earning potential', 'Creative freedom'],
          cons: ['Uncertain income', 'Need marketing skills', 'Algorithm dependency'],
          nearbyColleges: collegesData.filter(c => c.courses.some(course => course.includes('B.A')))
        }
      ]
    };

    return pathMappings[aspiration] || [
      {
        title: 'Skill-based Career',
        description: 'Focus on developing specific skills rather than traditional degrees',
        requirements: 'Professional certifications and practical experience',
        pros: ['Faster entry to job market', 'Industry-relevant skills', 'Lower education cost'],
        cons: ['May lack theoretical foundation', 'Need continuous upskilling'],
        nearbyColleges: collegesData.slice(0, 3)
      }
    ];
  };

  const handleAspirationSelect = (aspiration) => {
    setSelectedAspiration(aspiration);
    const paths = generateAlternativePaths(aspiration);
    setAlternativePaths(paths);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading alternative paths...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Alternative Career Paths
        </h2>
        <p className="text-center text-gray-600">
          Explore alternative routes to achieve your career goals
        </p>

        {/* Aspiration Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">What's your dream career?</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {commonAspirations.map((aspiration) => (
              <button
                key={aspiration}
                onClick={() => handleAspirationSelect(aspiration)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedAspiration === aspiration
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {aspiration}
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Paths Display */}
        {alternativePaths.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Alternative paths to become a {selectedAspiration}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativePaths.map((path, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-xl font-bold text-indigo-600 mb-3">{path.title}</h4>
                  <p className="text-gray-700 mb-4">{path.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Requirements:</h5>
                    <p className="text-sm text-gray-600">{path.requirements}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-green-600 text-sm mb-1">Pros:</h5>
                      <ul className="text-xs text-gray-600 list-disc list-inside">
                        {path.pros.map((pro, proIndex) => (
                          <li key={proIndex}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-red-600 text-sm mb-1">Cons:</h5>
                      <ul className="text-xs text-gray-600 list-disc list-inside">
                        {path.cons.map((con, conIndex) => (
                          <li key={conIndex}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-800 text-sm mb-2">Nearby Colleges:</h5>
                    <div className="space-y-1">
                      {path.nearbyColleges.slice(0, 2).map((college, collegeIndex) => (
                        <div key={collegeIndex} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <div className="font-medium">{college.name}</div>
                          <div>{college.location.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz-based Recommendations */}
        {quizResults && (
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Based on Your Quiz Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(quizResults.scores).map(([stream, score]) => (
                <div key={stream} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{score}</div>
                  <div className="text-sm text-gray-600">{stream}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-700">
              Your highest score is in <strong>{Object.keys(quizResults.scores).reduce((a, b) => 
                quizResults.scores[a] > quizResults.scores[b] ? a : b
              )}</strong>. Consider exploring careers in this field, or use the alternative paths above 
              to find different routes to your dream career.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlternativePaths;
