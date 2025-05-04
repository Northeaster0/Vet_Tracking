import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ phone: '', email: '', address: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const owner = JSON.parse(localStorage.getItem('owner') || '{}');
    if (owner.OwnerID) {
      fetch(`http://localhost:5000/api/owners/${owner.OwnerID}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData({ phone: data.Phone || '', email: data.Email || '', address: data.Address || '' });
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    const owner = JSON.parse(localStorage.getItem('owner') || '{}');
    if (owner.OwnerID) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/patientDashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Profil Bilgileri
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sadece Görüntülenebilir Alanlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kimlik No
                </label>
                <input
                  type="text"
                  value={profile.NationalID || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  value={profile.FName + ' ' + profile.LName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Düzenlenebilir Alanlar */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta Adresi
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Kaydet
            </button>
            {successMsg && <div className="text-center text-green-700 font-semibold mt-2">{successMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile; 