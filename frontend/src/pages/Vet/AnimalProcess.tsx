import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AnimalProcess: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const menuItems = [
    { title: 'Hasta Kabul', path: '/findAnimals', icon: '🏥', description: 'Mevcut hastaları görüntüle ve yeni hasta kabulü yap' },
    { title: 'Yeni Hayvan Ekle', path: '/addAnimal', icon: '🐾', description: 'Sisteme yeni hayvan kaydı oluştur' },
    { title: 'Yeni Müşteri Ekle', path: '/addClient', icon: '👤', description: 'Yeni müşteri kaydı oluştur' },
    { title: 'Stok Görüntüle', path: '/viewStocks', icon: '📦', description: 'İlaç ve malzeme stoklarını kontrol et' },
    { title: 'Geçmiş İşlemler', path: '/history', icon: '📋', description: 'Geçmiş işlemleri ve operasyonları görüntüle' },
    { title: 'Hasta Sil', path: '/deletePatient', icon: '❌', description: 'Sistemden hasta kaydını sil' }
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/doctor-login');
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
<div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Hayvan İşlemleri</h2>
              <p className="text-sm text-gray-500">Veteriner işlemlerini yönetin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/whatsWrong')}
              className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>Neyi Var Ki?</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-[#d68f13] transition duration-300 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#d68f13]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Çıkış Yapmak İstiyor Musunuz?</h3>
                <p className="text-gray-600 mb-6">Oturumunuz sonlandırılacak.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-[#d68f13] text-white rounded-lg hover:bg-[#b8770f] transition duration-300"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#d68f13]/10 p-3 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#d68f13] transition duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
              <div className="bg-[#d68f13]/5 px-6 py-3 border-t border-gray-100">
                <span className="text-[#d68f13] text-sm font-medium">Detayları Görüntüle →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalProcess; 