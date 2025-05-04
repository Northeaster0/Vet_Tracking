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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patientDashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Reçete Geçmişi
          </h2>

          {loading ? (
            <div className="text-center text-blue-700">Yükleniyor...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center text-gray-500">Reçete kaydı yok.</div>
          ) : (
            <div className="space-y-6">
              {groupedList.map((presc: any) => (
                <div key={presc.PrescriptionID} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                  <div className="mb-2">
                    <span className="font-semibold text-gray-800">Reçete #{presc.PrescriptionID}</span>
                  </div>
                  <ul className="space-y-2">
                    {presc.medicines.map((med: any, idx: number) => (
                      <li key={idx} className="border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:mb-0">
                        <div className="text-base text-gray-900 flex flex-wrap gap-x-4 items-center">
                          <span className="font-bold">{med.MedicineName}</span>
                          <span>•</span>
                          <span>{med.Dose}</span>
                          <span>•</span>
                          <span>{med.Frequency}</span>
                          <span>•</span>
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