import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const clinics = [
  { id: 1, name: 'VetKlinik 1' },
  { id: 2, name: 'VetKlinik 2' },
  { id: 3, name: 'VetKlinik 3' },
  { id: 4, name: 'VetKlinik 4' },
];

const exampleAnimals = [
  { id: 1, name: 'Pamuk' },
  { id: 2, name: 'Karabas' },
  { id: 3, name: 'Boncuk' },
];

const locales = { 'tr-TR': tr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const PatientAppointment: React.FC = () => {
  const [selectedClinic, setSelectedClinic] = useState<number>(clinics[0].id);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalTime, setModalTime] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<number>(exampleAnimals[0].id);
  const [modalReason, setModalReason] = useState('');

  // Takvimde boş bir alana tıklanınca modal aç
  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setModalTime('');
    setSelectedAnimal(exampleAnimals[0].id);
    setModalReason('');
    setShowModal(true);
  };

  // Modalda kaydet
  const handleModalSave = () => {
    if (!selectedDate || !modalTime || !selectedAnimal) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dateTime = `${dateStr}T${modalTime}`;
    setAppointments(prev => [
      ...prev,
      {
        title: `${clinics.find(c => c.id === selectedClinic)?.name} - ${exampleAnimals.find(a => a.id === selectedAnimal)?.name} - ${modalReason}`,
        start: new Date(dateTime),
        end: new Date(dateTime),
        clinicId: selectedClinic,
        animalId: selectedAnimal,
        reason: modalReason,
      }
    ]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* Klinik seçimi */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-blue-900 mb-2">Klinik Seçiniz</label>
          <select
            value={selectedClinic}
            onChange={e => setSelectedClinic(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
            ))}
          </select>
        </div>

        {/* Takvim */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Randevu Takvimi</h2>
          <Calendar
            localizer={localizer}
            events={appointments}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Hayvan Seç</label>
                <select
                  value={selectedAnimal}
                  onChange={e => setSelectedAnimal(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                >
                  {exampleAnimals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Randevu Sebebi</label>
                <textarea value={modalReason} onChange={e => setModalReason(e.target.value)} className="w-full px-3 py-2 border rounded" rows={2} placeholder="Sebep yazın..." />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                <input type="time" value={modalTime} onChange={e => setModalTime(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">İptal</button>
                <button onClick={handleModalSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Kaydet</button>
              </div>
            </div>
          </div>
        )}

        {/* En altta kaydet butonu */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => alert('Randevular kaydedildi!')}
            className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-bold shadow hover:bg-green-700 transition"
          >
            Randevuları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment; 