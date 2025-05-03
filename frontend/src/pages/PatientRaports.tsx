import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReports, addReport } from '../services/api';

interface Report {
  id: number;
  title: string;
  date: string;
  type: 'patoloji' | 'diger';
  fileUrl: string;
}

const PatientRaports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patoloji' | 'diger'>('patoloji');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
        setLoading(false);
      } catch (err) {
        setError('Raporlar yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      try {
        // Dosya yükleme işlemi burada yapılacak
        // Şimdilik sadece örnek bir URL kullanıyoruz
        const fileUrl = URL.createObjectURL(file);
        
        const newReport = {
          title: file.name,
          date: new Date().toISOString().split('T')[0],
          type: activeTab,
          fileUrl: fileUrl
        };

        const result = await addReport(newReport);
        setReports([...reports, { ...newReport, id: result.id }]);
        setSelectedFile(null);
      } catch (err) {
        setError('Rapor eklenirken bir hata oluştu');
      }
    }
  };

  const filteredReports = reports.filter(report => report.type === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-blue-900 text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patientAcception" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Raporlarım
          </h2>

          {/* Tab Menüsü */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('patoloji')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'patoloji'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Patoloji Raporlarım
            </button>
            <button
              onClick={() => setActiveTab('diger')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                activeTab === 'diger'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Diğer Raporlar
            </button>
          </div>

          {/* Rapor Listesi */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                    <p className="text-sm text-gray-600">Tarih: {report.date}</p>
                  </div>
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Görüntüle
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Yeni Rapor Ekleme */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Yeni Rapor Ekle
            </h3>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition duration-300"
              >
                Dosya Seç
              </label>
              {selectedFile && (
                <span className="text-gray-600">
                  Seçilen dosya: {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRaports; 