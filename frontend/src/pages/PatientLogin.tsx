import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FunFacts from '../components/FunFacts';
import logo from '../logo.svg';

const PatientLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await fetch('http://localhost:5000/api/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Giriş başarılı!');
        setIsError(false);
        localStorage.setItem('owner', JSON.stringify(data.owner));
        setTimeout(() => {
          navigate('/patient-dashboard');
        }, 1000);
      } else {
        setMessage(data.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Sunucuya bağlanılamadı.');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="flex w-full h-screen">
        {/* Sol panel: Logo, dalga ve gölgeli pati ikonu */}
        <div className="hidden md:flex flex-col justify-between items-center w-1/2 bg-[#d68f13] relative overflow-hidden p-8">
          {/* Gölgeli büyük pati arka plan */}
          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 drop-shadow-2xl z-0" width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="170" cy="220" rx="90" ry="60" fill="#fff"/>
            <ellipse cx="80" cy="120" rx="32" ry="44" fill="#fff"/>
            <ellipse cx="170" cy="80" rx="32" ry="44" fill="#fff"/>
            <ellipse cx="260" cy="120" rx="32" ry="44" fill="#fff"/>
            <ellipse cx="120" cy="180" rx="20" ry="14" fill="#fff"/>
            <ellipse cx="220" cy="180" rx="20" ry="14" fill="#fff"/>
          </svg>
          {/* Logo ve şirket ismi pati ikonunun üstünde, ortalanmış */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2 drop-shadow-lg" />
            <span className="text-white text-2xl font-bold tracking-widest">VETPACK</span>
          </div>
          {/* FunFacts sol panelin altında ortalanmış ve sabit kutuda */}
          <div className="w-full flex justify-center items-end z-10 absolute bottom-8 left-0">
            <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl px-8 py-5 w-full max-w-2xl h-[120px] flex items-start justify-start border border-[#d68f13]/30 backdrop-blur-md mx-8">
              <FunFacts />
            </div>
          </div>
          {/* Dalga SVG */}
          <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q250 120 500 40 L500 80 L0 80 Z" fill="#fff" fillOpacity="0.2" />
            <path d="M0 60 Q250 100 500 60 L500 80 L0 80 Z" fill="#fff" fillOpacity="0.1" />
          </svg>
        </div>
        {/* Sağ panel: Hasta girişi formu */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white relative z-10">
          <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100">
            {/* Geri tuşu */}
            <div className="mb-4">
              <Link to="/" className="inline-flex items-center text-[#d68f13] hover:text-[#b8770f] font-semibold text-lg">
                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Ana Sayfa
              </Link>
            </div>
            <div className="flex flex-row items-center justify-center mb-6 gap-2">
              {/* Hasta ikonu */}
              <svg className="w-8 h-8 text-[#d68f13]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
              <h2 className="text-xl font-bold text-[#d68f13] mb-0">Hasta Girişi</h2>
            </div>
            <p className="text-gray-500 text-center text-base mb-6">Devam etmek için hesabınıza giriş yapın</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] bg-gray-50 placeholder-gray-400 text-base"
                  placeholder="E-posta"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] bg-gray-50 placeholder-gray-400 text-base"
                  placeholder="Şifre"
                  required
                />
                <div className="text-right mt-1">
                  <a href="#" className="text-xs text-[#d68f13] hover:underline">Şifrenizi mi unuttunuz?</a>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#d68f13] text-white py-2 rounded-lg font-bold text-base shadow-md hover:bg-[#b8770f] transition duration-300"
              >
                Giriş Yap
              </button>
            </form>
            <div className="mt-4 text-center">
              <span className="text-gray-500">Hesabınız yok mu?</span>
              <a href="#" className="text-[#d68f13] hover:underline ml-1">Kayıt Ol</a>
            </div>
            <div className="mt-3 text-center">
              <Link to="/doctor-login" className="text-[#d68f13] hover:text-[#b8770f] font-semibold text-sm">
                Veteriner Girişi için tıklayın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin; 