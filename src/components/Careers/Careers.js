import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import degreesData from '../../data/degrees.json';

function Careers() {
  const { t } = useTranslation();
  const [openDegreeId, setOpenDegreeId] = useState(null);

  const toggleAccordion = (degreeId) => {
    setOpenDegreeId(openDegreeId === degreeId ? null : degreeId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t('careers')}</h2>

        <div className="space-y-4">
          {degreesData.map((degree) => (
            <div key={degree.id} className="border border-gray-200 rounded-lg shadow-sm">
              <button
                type="button"
                className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-lg"
                onClick={() => toggleAccordion(degree.id)}
              >
                <span>{degree.name} ({degree.streams.join(', ')})</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${openDegreeId === degree.id ? 'rotate-180' : 'rotate-0'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {openDegreeId === degree.id && (
                <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                  <p className="text-gray-700 mb-4">{degree.description}</p>

                  <h4 className="text-xl font-semibold mb-2">Higher Studies:</h4>
                  <ul className="list-disc list-inside mb-4">
                    {degree.higher_studies.map((study, index) => (
                      <li key={index}><strong>{study.name}:</strong> {study.description}</li>
                    ))}
                  </ul>

                  <h4 className="text-xl font-semibold mb-2">Job Roles:</h4>
                  <ul className="list-disc list-inside mb-4">
                    {degree.job_roles.map((role, index) => (
                      <li key={index}><strong>{role.name}:</strong> {role.description}</li>
                    ))}
                  </ul>

                  <h4 className="text-xl font-semibold mb-2">Relevant Exams:</h4>
                  <ul className="list-disc list-inside">
                    {degree.relevant_exams.map((exam, index) => (
                      <li key={index}>{exam}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Careers;

