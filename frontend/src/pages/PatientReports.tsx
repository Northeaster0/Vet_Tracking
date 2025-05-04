import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Report {
  id: number;
  title: string;
  date: string;
  fileUrl: string;
}

const TABS = [
  { key: 'patoloji', label: 'Patoloji' },
  { key: 'biyokimya', label: 'Biyokimya' },
  { key: 'diger', label: 'Diğer' },
];

const PatientReports: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

  const [activeTab, setActiveTab] = useState('patoloji');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/reports/files');
      const data = await res.json();
      console.log('API reports:', data);
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Raporlar getirilemedi!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !animalId) return;
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('animalId', animalId);
    formData.append('type', activeTab);
    formData.append('title', title || file.name);
    formData.append('date', new Date().toISOString().slice(0, 10));
    try {
      const res = await fetch('http://localhost:5000/api/reports/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadMsg('Rapor başarıyla yüklendi!');
        setFile(null);
        setTitle('');
        fetchReports();
      } else {
        setUploadMsg(data.error || 'Yükleme başarısız!');
      }
    } catch (err) {
      setUploadMsg('Sunucuya bağlanılamadı!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Raporlar</h2>
        <div className="flex gap-4 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-200 ${activeTab === tab.key ? 'border-blue-600 text-blue-900 bg-blue-100' : 'border-transparent text-gray-500 bg-gray-100 hover:bg-blue-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mb-8">
          {loading ? (
            <div className="text-blue-900">Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-gray-500">Mevcut rapor yok.</div>
          ) : (
            <ul className="space-y-4">
              {reports.map((report) => (
                <li key={report.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold text-blue-900">{report.title}</div>
                    <div className="text-sm text-gray-600">{report.date}</div>
                  </div>
                  <a
                    href={`http://localhost:5000${report.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    İndir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={handleUpload} className="bg-gray-50 p-4 rounded-lg flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Başlığı</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Başlık (isteğe bağlı)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosya Yükle (PDF veya Word)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            disabled={!file}
          >
            Rapor Yükle
          </button>
          {uploadMsg && <div className="text-center text-blue-900 font-semibold">{uploadMsg}</div>}
        </form>
      </div>
    </div>
  );
};

export default PatientReports; 