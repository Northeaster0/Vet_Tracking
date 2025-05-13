import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PatientPrescriptionsHistory: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animalId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/prescriptions?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => setPrescriptions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [animalId]);

  // PrescriptionID'ye göre grupla
  const grouped = prescriptions.reduce((acc, curr) => {
    const id = curr.PrescriptionID;
    if (!acc[id]) acc[id] = { ...curr, medicines: [] };
    acc[id].medicines.push({
      MedicineName: curr.MedicineName,
      Dose: curr.Dose,
      Frequency: curr.Frequency,
      Method: curr.Method
    });
    return acc;
  }, {} as Record<string, any>);
  const groupedList = Object.values(grouped);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">💊</span> Reçete Geçmişi
              </h2>
              <p className="text-sm text-gray-500">Hayvanın tüm reçete kayıtları</p>
            </div>
          </div>
          <Link
            to="/patient-dashboard"
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>

        {/* Ana Kart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="text-center text-gray-500">Yükleniyor...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center text-gray-500">Reçete kaydı yok.</div>
          ) : (
            <div className="space-y-6">
              {groupedList.map((presc: any) => (
                <div
                  key={presc.PrescriptionID}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-300 transform hover:scale-[1.01]"
                >
                  <div className="mb-4">
                    <span className="font-semibold text-gray-800 text-lg">Reçete #{presc.PrescriptionID}</span>
                  </div>
                  <ul className="space-y-4">
                    {presc.medicines.map((med: any, idx: number) => (
                      <li
                        key={idx}
                        className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0"
                      >
                        <div className="text-base text-gray-900 flex flex-wrap gap-x-4 items-center">
                          <span className="font-bold text-[#d68f13]">{med.MedicineName}</span>
                          <span className="text-gray-400">•</span>
                          <span>{med.Dose}</span>
                          <span className="text-gray-400">•</span>
                          <span>{med.Frequency}</span>
                          <span className="text-gray-400">•</span>
                          <span>{med.Method}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionsHistory; 