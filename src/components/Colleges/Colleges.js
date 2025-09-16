import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import collegesData from '../../data/colleges.json';

// Fix for Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Colleges() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const filteredColleges = collegesData.filter(college => {
    const matchesSearchTerm = college.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse ? college.courses.some(course => course.toLowerCase().includes(filterCourse.toLowerCase())) : true;
    const matchesRegion = filterRegion ? college.location.address.toLowerCase().includes(filterRegion.toLowerCase()) : true;
    return matchesSearchTerm && matchesCourse && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t('colleges')}</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by college name..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by course..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by region..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredColleges.map((college) => (
            <div key={college.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">{college.name}</h3>
              <p className="text-gray-700"><strong>Location:</strong> {college.location.address}</p>
              <p className="text-gray-700"><strong>Courses:</strong> {college.courses.join(', ')}</p>
              <p className="text-gray-700"><strong>Eligibility:</strong> {college.eligibility}</p>
              <p className="text-gray-700"><strong>Facilities:</strong> {college.facilities.join(', ')}</p>
            </div>
          ))}
        </div>

        <div className="h-[500px] w-full rounded-lg shadow-md overflow-hidden">
          <MapContainer center={[33.7782, 76.5762]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredColleges.map((college) => (
              <Marker key={college.id} position={[college.location.latitude, college.location.longitude]}>
                <Popup>
                  <div>
                    <h4 className="font-bold">{college.name}</h4>
                    <p>{college.location.address}</p>
                    <p>Courses: {college.courses.join(', ')}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default Colleges;

