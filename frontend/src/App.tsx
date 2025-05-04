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
import PatientRaports from './pages/PatientRaports';
import Operations from './pages/Operations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <div className="text-center mt-16 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
                Dijital Veteriner Takip Sistemi
              </h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-[80px]">
              <Link
                to="/doctor-login"
                className="w-64 h-64 flex items-center justify-center bg-blue-600 text-white rounded-lg text-2xl font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Doktor Girişi
              </Link>
              
              <Link
                to="/patient-login"
                className="w-64 h-64 flex items-center justify-center bg-green-600 text-white rounded-lg text-2xl font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
                Hasta Girişi
              </Link>
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
        <Route path="/patient-raports" element={<PatientRaports />} />
        <Route path="/operations" element={<Operations />} />
      </Routes>
    </Router>
  );
}

export default App;
