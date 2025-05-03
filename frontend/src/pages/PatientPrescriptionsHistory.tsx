import React from 'react';
import { Link } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const prescriptions = [
  {
    id: 1,
    date: '2024-03-15',
    doctor: 'Dr. Ahmet Yılmaz',
    disease: 'Kulak Enfeksiyonu',
    medicines: [
      {
        name: 'Antibiyotik X',
        dose: '1 tablet',
        frequency: 'Günde 2 kez',
        duration: '7 gün'
      },
      {
        name: 'Ağrı Kesici Y',
        dose: '1 tablet',
        frequency: 'Gerektiğinde',
        duration: '3 gün'
      }
    ],
    notes: 'Kulak temizliği yapıldı. 1 hafta sonra kontrol.'
  },
  {
    id: 2,
    date: '2024-02-20',
    doctor: 'Dr. Mehmet Demir',
    disease: 'Deri Alerjisi',
    medicines: [
      {
        name: 'Antihistamin Z',
        dose: '1 tablet',
        frequency: 'Günde 1 kez',
        duration: '10 gün'
      },
      {
        name: 'Krem A',
        dose: 'İnce tabaka',
        frequency: 'Günde 2 kez',
        duration: '7 gün'
      }
    ],
    notes: 'Alerji testi yapıldı. Özel mama önerildi.'
  }
];

const PatientPrescriptionsHistory: React.FC = () => {
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

          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {prescription.disease}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tarih: {prescription.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      Doktor: {prescription.doctor}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    İlaçlar:
                  </h4>
                  <ul className="space-y-2">
                    {prescription.medicines.map((medicine, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <span className="font-medium">{medicine.name}</span>
                        <span className="mx-2">•</span>
                        {medicine.dose}
                        <span className="mx-2">•</span>
                        {medicine.frequency}
                        <span className="mx-2">•</span>
                        {medicine.duration}
                      </li>
                    ))}
                  </ul>
                </div>

                {prescription.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Notlar:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {prescription.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionsHistory; 