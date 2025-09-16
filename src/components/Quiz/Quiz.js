import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import quizQuestions from '../../data/quizQuestions.json';
import QuizResults from './QuizResults';

function Quiz() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState(null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    const newScores = {
      Science: 0,
      Arts: 0,
      Commerce: 0,
    };

    quizQuestions.forEach((question) => {
      const selectedValue = answers[question.id];
      if (selectedValue) {
        newScores[question.category] += selectedValue;
      }
    });
    setScores(newScores);
    setShowResults(true);
  };

  if (showResults) {
    return <QuizResults scores={scores} onRetake={() => setShowResults(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t('quiz')}</h2>
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          {quizQuestions.map((question) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
              <p className="text-lg font-medium text-gray-800 mb-4">{question.question}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {question.options.map((option) => (
                  <label key={option.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      onChange={() => handleAnswerChange(question.id, option.value)}
                      checked={answers[question.id] === option.value}
                      className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-gray-700">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

export default Quiz;
