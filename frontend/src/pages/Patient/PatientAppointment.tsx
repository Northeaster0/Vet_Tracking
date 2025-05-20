import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📅</span> Randevu Takvimi
              </h2>
              <p className="text-sm text-gray-500">Hayvanlarınız için randevu oluşturun ve yönetin</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Klinik seçimi */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-lg font-bold text-gray-800 mb-2">Klinik Seçiniz</label>
          <select
            value={selectedClinic}
            onChange={e => setSelectedClinic(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
          >
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
            ))}
          </select>
        </div>

        {/* Takvim */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Yeni Randevu Oluştur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <input
                    type="text"
                    value={selectedDate?.toLocaleDateString('tr-TR')}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hayvan Seç</label>
                  <select
                    value={selectedAnimal}
                    onChange={e => setSelectedAnimal(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                  >
                    {exampleAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Randevu Sebebi</label>
                  <textarea
                    value={modalReason}
                    onChange={e => setModalReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                    rows={2}
                    placeholder="Sebep yazın..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Saat</label>
                  <input
                    type="time"
                    value={modalTime}
                    onChange={e => setModalTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition duration-300 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleModalSave}
                    className="px-6 py-3 bg-[#d68f13] text-white rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* En altta kaydet butonu */}
        <div className="flex justify-center">
          <button
            onClick={() => alert('Randevular kaydedildi!')}
            className="px-8 py-3 bg-[#d68f13] text-white rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            Randevuları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment; 