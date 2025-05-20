import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identityNo: '',
    name: '',
    phoneNo: '',
    email: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await fetch('http://localhost:5000/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`Müşteri başarıyla eklendi! Şifreniz: ${data.password}`);
        setIsError(false);
        setFormData({ identityNo: '', name: '', phoneNo: '', email: '', address: '' });
      } else {
        setMessage(data.message || 'Müşteri eklenemedi!');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Sunucuya bağlanılamadı!');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Yeni Müşteri Ekle</h2>
              <p className="text-sm text-gray-500">Sisteme yeni müşteri kaydı oluşturun</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Geri Dön
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Identity Number */}
              <div>
                <label htmlFor="identityNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Kimlik No
                </label>
                <input
                  type="text"
                  id="identityNo"
                  name="identityNo"
                  value={formData.identityNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                  pattern="[0-9]{11}"
                  title="11 haneli kimlik numarası giriniz"
                />
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  İsim
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon No
                </label>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  required
                  pattern="[0-9]{10}"
                  title="10 haneli telefon numarası giriniz"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Mail Adresi
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

              {/* Address */}
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
            </div>

            <button
              type="submit"
              className="w-full bg-[#d68f13] text-white py-3 px-4 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-[1.02] shadow-lg mt-6 font-semibold"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClient;