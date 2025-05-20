import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerAuth } from '../../contexts/OwnerAuthContext';

const ClientProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ phone: '', email: '', address: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const { owner } = useOwnerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (owner?.OwnerID) {
      fetch(`http://localhost:5000/api/owners/${owner.OwnerID}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData({ phone: data.Phone || '', email: data.Email || '', address: data.Address || '' });
        });
    }
  }, [owner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    if (owner?.OwnerID) {
      const response = await fetch(`http://localhost:5000/api/owners/${owner.OwnerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Profil başarıyla güncellendi!');
      } else {
        setSuccessMsg('Profil güncellenemedi!');
      }
    }
  };

  if (!profile) return <div>Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">👤</span> Profil Bilgileri
              </h2>
              <p className="text-sm text-gray-500">Kişisel bilgilerinizi görüntüleyin ve güncelleyin</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Message Display */}
        {successMsg && <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 text-center font-semibold">{successMsg}</div>}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sadece Görüntülenebilir Alanlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kimlik No
                </label>
                <input
                  type="text"
                  value={profile.NationalID || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İsim
                </label>
                <input
                  type="text"
                  value={profile.FName + ' ' + profile.LName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            {/* Düzenlenebilir Alanlar */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg font-semibold"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 