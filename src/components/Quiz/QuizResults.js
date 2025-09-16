import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function QuizResults({ scores, onRetake }) {
  const { t } = useTranslation();

  const data = {
    labels: Object.keys(scores).map(key => t(key.toLowerCase())),
    datasets: [
      {
        label: 'Your Score',
        data: Object.values(scores),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aptitude & Interest Quiz Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50, // Assuming max score per category is 10 questions * 5 (max value) = 50
      },
    },
  };

  // Determine the recommended stream (simple rule-based logic for MVP)
  const getRecommendation = () => {
    let maxScore = 0;
    let recommendedStream = '';
    for (const stream in scores) {
      if (scores[stream] > maxScore) {
        maxScore = scores[stream];
        recommendedStream = stream;
      }
    }
    return recommendedStream;
  };

  const recommendedStream = getRecommendation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Quiz Results</h2>
        <div className="p-4">
          <Bar data={data} options={options} />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold mt-4">
            Based on your responses, your recommended stream is: <span className="text-indigo-600">{t(recommendedStream.toLowerCase())}</span>
          </p>
          <button
            onClick={onRetake}
            className="mt-8 w-auto inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
