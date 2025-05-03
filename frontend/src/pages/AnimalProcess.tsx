import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AnimalProcess: React.FC = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: 'Hasta Kabul', path: '/findAnimals', color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Yeni Hayvan Ekle', path: '/addAnimal', color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Yeni Müşteri Ekle', path: '/addClient', color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'Stok Görüntüle', path: '/viewStocks', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { title: 'Geçmiş İşlemler', path: '/history', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { title: 'Hasta Sil', path: '/deletePatient', color: 'bg-red-600 hover:bg-red-700' }
  ];

  const handleLogout = () => {
    navigate('/doctor-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/doctor-login" 
            className="text-blue-600 hover:text-blue-800 text-3xl font-bold inline-block"
          >
            ←
          </Link>
          <Link
            to="/whatsWrong"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Sorun Bildir
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">
          Hayvan İşlemleri
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`${item.color} text-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 flex items-center justify-center text-center`}
            >
              <span className="text-lg font-semibold">{item.title}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default AnimalProcess; 