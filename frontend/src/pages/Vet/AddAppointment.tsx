import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useVetAuth } from '../../contexts/VetAuthContext';
import { useOwnerAuth } from '../../contexts/OwnerAuthContext';

// Örnek veriler (ileride API'den gelecek)
const appointmentTypes = [
  { id: 1, name: 'Aşı' },
  { id: 2, name: 'Muayene' },
  { id: 3, name: 'Operasyon' }
];

const vaccineTypes = [
  { id: 1, name: 'Karma Aşı' },
  { id: 2, name: 'Kuduz Aşısı' },
  { id: 3, name: 'Parazit Aşısı' }
];

const operationTypes = [
  { id: 1, name: 'Kısırlaştırma' },
  { id: 2, name: 'Tümör Alımı' },
  { id: 3, name: 'Diş Temizliği' }
];

const locales = {
  'tr-TR': tr,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AddAppointment: React.FC = () => {
  const [formData, setFormData] = useState({
    dateTime: '',
    appointmentType: '',
    vaccineType: '',
    operationType: '',
    examinationNote: ''
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalTime, setModalTime] = useState('');
  const [modalNote, setModalNote] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const animalId = params.get('animalId');

  const { vet } = useVetAuth();
  const { owner } = useOwnerAuth();

  const navigate = useNavigate();

  // Randevuları çek
  useEffect(() => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/appointments?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array before setting it
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      });
  }, [animalId]);

  // Randevu eklenince tekrar çek
  const fetchAppointments = () => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/appointments?animalId=${animalId}`)
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array before setting it
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let reason = '';
    if (formData.appointmentType === 'Aşı') reason = formData.vaccineType;
    else if (formData.appointmentType === 'Muayene') reason = formData.examinationNote;
    else if (formData.appointmentType === 'Operasyon') reason = formData.operationType;
    else reason = formData.appointmentType;

    const payload = {
      VeterinaryID: vet?.VeterinaryID || 1,
      AnimalID: Number(animalId),
      OwnerID: owner?.OwnerID || 1,
      AppointmentDateTime: formData.dateTime,
      Reason: reason,
      Status: 'Scheduled',
      CreatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Randevu başarıyla oluşturuldu!');
    setFormData({
      dateTime: '',
      appointmentType: '',
      vaccineType: '',
      operationType: '',
      examinationNote: ''
    });
        fetchAppointments();
      } else {
        alert(data.message || 'Randevu oluşturulamadı!');
      }
    } catch (err) {
      alert('Sunucuya bağlanılamadı!');
    }
  };

  // Takvimde boş bir alana tıklanınca modal aç
  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setModalTime('');
    setModalNote('');
    setShowModal(true);
  };

  // Modalda kaydet
  const handleModalSave = async () => {
    if (!selectedDate || !modalTime) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dateTime = `${dateStr}T${modalTime}`;
    const payload = {
      VeterinaryID: vet?.VeterinaryID || 1,
      AnimalID: Number(animalId),
      OwnerID: owner?.OwnerID || 1,
      AppointmentDateTime: dateTime,
      Reason: modalNote,
      Status: 'Scheduled',
      CreatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        fetchAppointments();
      } else {
        alert(data.message || 'Randevu oluşturulamadı!');
      }
    } catch (err) {
      alert('Sunucuya bağlanılamadı!');
    }
  };

  // Randevuları takvim eventlerine dönüştür
  const events = appointments.map(a => ({
    title: a.Reason || 'Randevu',
    start: new Date(a.AppointmentDateTime),
    end: new Date(a.AppointmentDateTime),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#b8770f] hover:text-[#b8770f] text-3xl font-bold mb-4 inline-block"
        >
          ←
        </button>

        {/* Takvim görünümü */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-[#b8770f] mb-4">Randevu Takvimi</h3>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            messages={{
              next: 'İleri',
              previous: 'Geri',
              today: 'Bugün',
              month: 'Ay',
              week: 'Hafta',
              day: 'Gün',
              agenda: 'Ajanda',
            }}
            culture="tr-TR"
            selectable
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Yeni Randevu Oluştur</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input type="text" value={selectedDate?.toLocaleDateString('tr-TR')} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                <input type="time" value={modalTime} onChange={e => setModalTime(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Veteriner Hekim Yorumu</label>
                <textarea value={modalNote} onChange={e => setModalNote(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} placeholder="Yorum yazın..." />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">İptal</button>
                <button onClick={handleModalSave} className="px-4 py-2 bg-[#b8770f] text-white rounded hover:bg-[#b8770f]">Kaydet</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAppointment; 