const API_URL = 'http://localhost:5000/api';

export const getReports = async () => {
  const response = await fetch(`${API_URL}/reports`);
  if (!response.ok) {
    throw new Error('Raporlar getirilemedi');
  }
  return response.json();
};

export const addReport = async (report: {
  title: string;
  date: string;
  type: 'patoloji' | 'diger';
  fileUrl: string;
}) => {
  const response = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    throw new Error('Rapor eklenemedi');
  }
  return response.json();
}; 