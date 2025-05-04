import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import AnimalProcess from './pages/AnimalProcess';
import PatientAcception from './pages/PatientAcception';
import AddAnimal from './pages/AddAnimal';
import AddClient from './pages/AddClient';
import ViewStocks from './pages/ViewStocks';
import History from './pages/History';
import DeletePatient from './pages/DeletePatient';
import AddAppointment from './pages/AddAppointment';
import Tests from './pages/Tests';
import AnimalHistory from './pages/AnimalHistory';
import AddPrescriptions from './pages/AddPrescriptions';
import EditPatientInfo from './pages/EditPatientInfo';
import PatientDashboard from './pages/PatientDashboard';
import ClientProfile from './pages/ClientProfile';
import PatientPrescriptionsHistory from './pages/PatientPrescriptionsHistory';
import PatientTestResults from './pages/PatientTestResults';
import PatientVaccineStatus from './pages/PatientVaccineStatus';
import WhatsWrong from './pages/WhatsWrong';
import FindAnimals from './pages/FindAnimals';
import DoctorVaccineStatus from './pages/DoctorVaccineStatus';
import Operations from './pages/Operations';
// import PatientRaports from './pages/PatientRaports';
import logo from './logo.svg';
import FunFacts from './components/FunFacts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex w-full">
            {/* Sol panel: Logo, marka, pati, FunFacts */}
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
              {/* Logo ve marka ismi pati üstünde */}
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
            {/* Sağ panel: Giriş seçenekleri */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white relative z-10 p-8">
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#d68f13] mb-8 text-center">Dijital Veteriner Takip Sistemi</h1>
              <div className="flex flex-col gap-8 w-full max-w-md">
                <Link
                  to="/doctor-login"
                  className="w-full h-20 flex items-center justify-center bg-[#d68f13] text-white rounded-xl text-lg font-semibold hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="17" r="3" />
                    <path d="M18 14V5a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v9a5 5 0 0 1-10 0V5" />
                    <path d="M6 21v-2a4 4 0 0 0 8 0v-2" />
                  </svg>
                  Doktor Girişi
                </Link>
                <Link
                  to="/patient-login"
                  className="w-full h-20 flex items-center justify-center bg-[#d68f13] text-white rounded-xl text-lg font-semibold hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
                  Hasta Girişi
                </Link>
              </div>
            </div>
          </div>
        } />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/animal-process" element={<AnimalProcess />} />
        <Route path="/patientAcception" element={<PatientAcception />} />
        <Route path="/addAnimal" element={<AddAnimal />} />
        <Route path="/addClient" element={<AddClient />} />
        <Route path="/viewStocks" element={<ViewStocks />} />
        <Route path="/history" element={<History />} />
        <Route path="/deletePatient" element={<DeletePatient />} />
        <Route path="/addAppointment" element={<AddAppointment />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/animalHistory" element={<AnimalHistory />} />
        <Route path="/addPrescriptions" element={<AddPrescriptions />} />
        <Route path="/editPatientInfo" element={<EditPatientInfo />} />
        <Route path="/patientDashboard" element={<PatientDashboard />} />
        <Route path="/patientProfile" element={<ClientProfile />} />
        <Route path="/patientPrescriptionsHistory" element={<PatientPrescriptionsHistory />} />
        <Route path="/patientTestResults" element={<PatientTestResults />} />
        <Route path="/patientVaccineStatus" element={<PatientVaccineStatus />} />
        <Route path="/whatsWrong" element={<WhatsWrong />} />
        <Route path="/findAnimals" element={<FindAnimals />} />
        <Route path="/doctorVaccineStatus" element={<DoctorVaccineStatus />} />
        <Route path="/operations" element={<Operations />} />
      </Routes>
    </Router>
  );
}

export default App;
