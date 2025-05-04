import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define types for our data
interface Species {
  id: number;
  name: string;
}

interface Breed {
  id: number;
  name: string;
  speciesId: number;
}

interface Complaint {
  id: number;
  name: string;
  description: string;
}

interface Diagnosis {
  id: number;
  name: string;
  description: string;
  complaintIds: number[]; // Complaints associated with this diagnosis
  speciesIds: number[]; // Species this diagnosis applies to
  breedIds?: number[]; // Optional: specific breeds this applies to
  ageRanges?: string[]; // Optional: age ranges this applies to
  genders?: string[]; // Optional: genders this applies to
}

const mockSpecies: Species[] = [
  { id: 1, name: 'Köpek' },
  { id: 2, name: 'Kedi' },
  { id: 3, name: 'Kuş' },
  { id: 4, name: 'Kemirgen' },
  { id: 5, name: 'Sığır' },  // Yeni eklendi
  { id: 6, name: 'Egzotik' } // Yeni eklendi
];

// Yeni ırkların eklenmesi
const mockBreeds: Breed[] = [
  // Köpek ırkları (speciesId: 1)
  { id: 1, name: 'Golden Retriever', speciesId: 1 },
  { id: 2, name: 'Alman Çoban Köpeği', speciesId: 1 },
  { id: 3, name: 'Terrier', speciesId: 1 },
  { id: 4, name: 'Labrador Retriever', speciesId: 1 },
  { id: 5, name: 'Bulldog', speciesId: 1 },
  { id: 6, name: 'Pomeranian', speciesId: 1 },
  { id: 7, name: 'Rottweiler', speciesId: 1 },
  { id: 8, name: 'Beagle', speciesId: 1 },
  { id: 9, name: 'Siberian Husky', speciesId: 1 },
  { id: 10, name: 'Poodle', speciesId: 1 },
  { id: 11, name: 'Chihuahua', speciesId: 1 },
  { id: 12, name: 'Boxer', speciesId: 1 },
  { id: 13, name: 'Doberman', speciesId: 1 },
  { id: 14, name: 'Dachshund', speciesId: 1 },
  { id: 15, name: 'Cocker Spaniel', speciesId: 1 },
  { id: 16, name: 'Shih Tzu', speciesId: 1 },
  { id: 17, name: 'Border Collie', speciesId: 1 },
  { id: 18, name: 'Great Dane', speciesId: 1 },
  { id: 19, name: 'Akita Inu', speciesId: 1 },
  { id: 20, name: 'French Bulldog', speciesId: 1 },
  { id: 21, name: 'Kangal', speciesId: 1 },
  
  // Kedi ırkları (speciesId: 2)
  { id: 22, name: 'British Shorthair', speciesId: 2 },
  { id: 23, name: 'Scottish Fold', speciesId: 2 },
  { id: 24, name: 'Siyam Kedisi', speciesId: 2 },
  
  // Kuş türleri (speciesId: 3)
  { id: 25, name: 'Muhabbet Kuşu', speciesId: 3 },
  { id: 26, name: 'Papağan', speciesId: 3 },
  { id: 27, name: 'Kanarya', speciesId: 3 },
  { id: 28, name: 'Serçe', speciesId: 3 },
  { id: 29, name: 'Tavuk', speciesId: 3 },
  
  // Kemirgenler (speciesId: 4)
  { id: 30, name: 'Hamster', speciesId: 4 },
  { id: 31, name: 'Guinea Pig', speciesId: 4 },
  
  // Sığır türleri (speciesId: 5)
  { id: 32, name: 'Holstein', speciesId: 5 },
  { id: 33, name: 'Simental', speciesId: 5 },
  { id: 34, name: 'Jersey', speciesId: 5 },
  { id: 35, name: 'Montbeliarde', speciesId: 5 },
  { id: 36, name: 'Brown Swiss', speciesId: 5 },
  
  // Egzotik türler (speciesId: 6)
  { id: 37, name: 'Kral Pitonu', speciesId: 6 },
  { id: 38, name: 'Sibirya Kaplanı', speciesId: 6 },
  { id: 39, name: 'Yavru Aslan', speciesId: 6 },
  { id: 40, name: 'Ağaç İguanası', speciesId: 6 },
  { id: 41, name: 'Mavi Ara Papağan', speciesId: 6 }
];

// Şikayet listesinin güncellenmesi
const mockComplaints: Complaint[] = [
  { id: 1, name: 'İştahsızlık', description: 'Hayvan yemek yemeyi reddediyor' },
  { id: 2, name: 'Kusma', description: 'Hayvan kusma belirtileri gösteriyor' },
  { id: 3, name: 'İshal', description: 'Hayvanın dışkısı normalden daha sulu' },
  { id: 4, name: 'Ateş', description: 'Hayvanın vücut sıcaklığı normalden yüksek' },
  { id: 5, name: 'Halsizlik', description: 'Hayvan normalden daha az aktif' },
  { id: 6, name: 'Öksürük', description: 'Hayvan sürekli öksürüyor' },
  { id: 7, name: 'Kaşıntı', description: 'Hayvan sürekli kaşınıyor' },
  { id: 8, name: 'Burun akıntısı', description: 'Hayvanın burnundan anormal akıntı geliyor' },
  { id: 9, name: 'Gözlerde iltihaplanma', description: 'Gözlerde kızarıklık ve iltihaplanma görülüyor' },
  { id: 10, name: 'Nöbetler', description: 'Hayvan nöbet geçiriyor veya kas seğirmeleri yaşıyor' },
  { id: 11, name: 'Koordinasyon kaybı', description: 'Hayvan dengede durmakta zorlanıyor' },
  { id: 12, name: 'Felç', description: 'Hayvanın belirli uzuvlarını hareket ettirememesi' },
  { id: 13, name: 'Çene çarpması', description: 'Karakteristik titreme hareketi' },
  { id: 14, name: 'Burun/ayak kalınlaşması', description: 'Burun ve ayak tabanlarında sertleşme' },
  { id: 15, name: 'Kanlı ishal', description: 'Dışkıda kan görülmesi' },
  { id: 16, name: 'Dehidrasyon', description: 'Vücutta su kaybı belirtileri' },
  { id: 17, name: 'Miyokardit', description: 'Kalp kası iltihabı belirtileri' },
  { id: 18, name: 'Kuru öksürük', description: 'Havlar tarzda kuru öksürük' },
  { id: 19, name: 'Boğazda gıcık', description: 'Boğazda gıcık hissi ve öğürme' },
  { id: 20, name: 'Sarılık', description: 'Deri ve gözlerde sarı renk' },
  { id: 21, name: 'Kanlı idrar', description: 'İdrarda kan görülmesi' },
  { id: 22, name: 'Meme hassasiyeti', description: 'Meme bezlerinde hassasiyet' },
  { id: 23, name: 'Süt veriminde düşüş', description: 'Ani süt veriminde azalma' }
];

// Teşhis listesinin güncellenmesi
const mockDiagnoses: Diagnosis[] = [
  {
    id: 1,
    name: 'Kennel Öksürüğü',
    description: 'Bulaşıcı trakeobronşit, köpeklerde yaygın bir solunum yolu enfeksiyonudur.',
    complaintIds: [5, 6, 8, 18, 19],
    speciesIds: [1]
  },
  {
    id: 2,
    name: 'Parvovirus',
    description: 'Köpeklerde görülen bulaşıcı viral bir hastalıktır. Aşı ile önlenebilir.',
    complaintIds: [1, 2, 3, 4, 15, 16, 17],
    speciesIds: [1]
  },
  {
    id: 3,
    name: 'Üst Solunum Yolu Enfeksiyonu',
    description: 'Kedilerde yaygın görülen, genellikle viral bir hastalıktır.',
    complaintIds: [4, 5, 6, 8, 9],
    speciesIds: [2]
  },
  {
    id: 4,
    name: 'Pire Alerjisi',
    description: 'Pire ısırıklarına karşı alerjik reaksiyon.',
    complaintIds: [7],
    speciesIds: [1, 2]
  },
  {
    id: 5,
    name: 'Distemper (Köpek Gençlik Hastalığı)',
    description: 'Yüksek bulaşıcılığa sahip viral bir hastalıktır. Aşı ile önlenebilir.',
    complaintIds: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14],
    speciesIds: [1],
    ageRanges: ['0-6 ay', '6-12 ay']
  },
];


const ageRanges = [
  '0-6 ay',
  '6-12 ay',
  '1-3 yaş',
  '3-7 yaş',
  '7+ yaş'
];

const genders = ['Erkek', 'Dişi'];

const WhatsWrong: React.FC = () => {
  // State management
  const [step, setStep] = useState<number>(1);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedComplaints, setSelectedComplaints] = useState<Complaint[]>([]);
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<Diagnosis[]>([]);
  
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);

  // Update filtered breeds when species is selected
  useEffect(() => {
    if (selectedSpecies) {
      const breeds = mockBreeds.filter(breed => breed.speciesId === selectedSpecies.id);
      setFilteredBreeds(breeds);
    } else {
      setFilteredBreeds([]);
    }
  }, [selectedSpecies]);

  // Calculate possible diagnoses based on selections
  useEffect(() => {
    if (step === 5 && selectedComplaints.length > 0 && selectedSpecies) {
      const complaintIds = selectedComplaints.map(complaint => complaint.id);
      
      // Filter diagnoses based on selected criteria
      const diagnoses = mockDiagnoses.filter(diagnosis => {
        // Must match species
        if (!diagnosis.speciesIds.includes(selectedSpecies.id)) return false;
        
        // Must have at least one matching complaint
        if (!complaintIds.some(id => diagnosis.complaintIds.includes(id))) return false;
        
        // Check breed if specified
        if (diagnosis.breedIds && selectedBreed && 
            !diagnosis.breedIds.includes(selectedBreed.id)) return false;
        
        // Check age if specified
        if (diagnosis.ageRanges && selectedAge && 
            !diagnosis.ageRanges.includes(selectedAge)) return false;
            
        // Check gender if specified
        if (diagnosis.genders && selectedGender && 
            !diagnosis.genders.includes(selectedGender)) return false;
            
        return true;
      });
      
      setPossibleDiagnoses(diagnoses);
    }
  }, [step, selectedSpecies, selectedBreed, selectedGender, selectedAge, selectedComplaints]);

  const handleSpeciesSelect = (species: Species) => {
    setSelectedSpecies(species);
    setSelectedBreed(null); // Reset breed when species changes
    setStep(2);
  };

  const handleBreedSelect = (breed: Breed) => {
    setSelectedBreed(breed);
    setStep(3);
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setStep(4);
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    setStep(5);
  };

  const toggleComplaint = (complaint: Complaint) => {
    if (selectedComplaints.find(c => c.id === complaint.id)) {
      setSelectedComplaints(selectedComplaints.filter(c => c.id !== complaint.id));
    } else {
      setSelectedComplaints([...selectedComplaints, complaint]);
    }
  };

  const handleComplaintsSubmit = () => {
    setStep(6);
  };

  const resetDiagnostic = () => {
    setStep(1);
    setSelectedSpecies(null);
    setSelectedBreed(null);
    setSelectedGender(null);
    setSelectedAge(null);
    setSelectedComplaints([]);
    setPossibleDiagnoses([]);
  };

  // Handle going back to a specific step
  const handleGoToStep = (targetStep: number) => {
    // Reset data for steps after the target step
    if (targetStep < 2) setSelectedSpecies(null);
    if (targetStep < 3) setSelectedBreed(null);
    if (targetStep < 4) setSelectedGender(null);
    if (targetStep < 5) setSelectedAge(null);
    if (targetStep < 6 && step === 6) setPossibleDiagnoses([]);
    
    setStep(targetStep);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Hayvan Türünü Seçin</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockSpecies.map(species => (
                <button
                  key={species.id}
                  onClick={() => handleSpeciesSelect(species)}
                  className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition-colors"
                >
                  {species.name}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {selectedSpecies?.name} Cinsini Seçin
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredBreeds.map(breed => (
                <button
                  key={breed.id}
                  onClick={() => handleBreedSelect(breed)}
                  className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition-colors"
                >
                  {breed.name}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cinsiyet Seçin</h2>
            <div className="grid grid-cols-2 gap-4">
              {genders.map(gender => (
                <button
                  key={gender}
                  onClick={() => handleGenderSelect(gender)}
                  className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition-colors"
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Yaş Aralığını Seçin</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ageRanges.map(age => (
                <button
                  key={age}
                  onClick={() => handleAgeSelect(age)}
                  className="p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition-colors"
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Belirtileri Seçin</h2>
            <p className="mb-4 text-gray-600">Birden fazla belirti seçebilirsiniz</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {mockComplaints.map(complaint => (
                <button
                  key={complaint.id}
                  onClick={() => toggleComplaint(complaint)}
                  className={`p-4 rounded-lg shadow text-left transition-colors ${
                    selectedComplaints.find(c => c.id === complaint.id)
                      ? 'bg-blue-400 text-white'
                      : 'bg-blue-100 hover:bg-blue-200'
                  }`}
                >
                  <strong>{complaint.name}</strong>
                  <p className="text-sm">{complaint.description}</p>
                </button>
              ))}
            </div>

          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Olası Tanılar</h2>
            {possibleDiagnoses.length > 0 ? (
              <div className="space-y-4">
                {possibleDiagnoses.map(diagnosis => (
                  <div key={diagnosis.id} className="p-4 bg-white rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-700">{diagnosis.name}</h3>
                    <p className="text-gray-600 mt-2">{diagnosis.description}</p>
                    <div className="mt-2">
                      <span className="text-sm font-semibold">İlişkili Belirtiler: </span>
                      {diagnosis.complaintIds
                        .map(id => mockComplaints.find(c => c.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 rounded-lg">
                <p>Seçilen kriterlere uygun tanı bulunamadı. Lütfen bir veteriner hekime başvurun.</p>
              </div>
            )}
            <button
              onClick={resetDiagnostic}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Yeni Tanı Başlat
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Generate step labels for progress navigation
  const stepLabels = [
    "Tür",
    "Cins",
    "Cinsiyet",
    "Yaş",
    "Belirtiler",
    "Tanılar"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/patient-Dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Ana Sayfa</span>
          </Link>
          <h1 className="text-3xl font-bold text-center text-blue-800">Veteriner Tanı Sistemi</h1>
          <div className="w-24">
            {/* Empty div to balance the layout */}
          </div>
        </div>

        {/* Interactive Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
          
          {/* Step indicators with click functionality */}
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, index) => {
              const stepNum = index + 1;
              const isActive = stepNum <= step;
              const isSelectable = stepNum < step; // Only previous steps are selectable
              
              return (
                <button
                  key={stepNum}
                  onClick={() => isSelectable ? handleGoToStep(stepNum) : null}
                  disabled={!isSelectable}
                  className={`relative flex flex-col items-center ${
                    isSelectable ? 'cursor-pointer text-blue-600 hover:text-blue-800' : 
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mb-1 ${
                    isActive ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary of selections with edit buttons */}
        {step > 1 && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Seçimleriniz:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSpecies && (
                <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-sm">
                  <span>Tür: {selectedSpecies.name}</span>
                  <button 
                    onClick={() => handleGoToStep(1)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedBreed && (
                <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-sm">
                  <span>Cins: {selectedBreed.name}</span>
                  <button 
                    onClick={() => handleGoToStep(2)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedGender && (
                <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-sm">
                  <span>Cinsiyet: {selectedGender}</span>
                  <button 
                    onClick={() => handleGoToStep(3)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              {selectedAge && (
                <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-sm">
                  <span>Yaş: {selectedAge}</span>
                  <button 
                    onClick={() => handleGoToStep(4)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              {step > 5 && selectedComplaints.map(complaint => (
                <div key={complaint.id} className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-sm">
                  <span>{complaint.name}</span>
                  <button 
                    onClick={() => handleGoToStep(5)} 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        {step > 1 && step < 6 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </button>
            {step === 5 && (
              <button
                onClick={handleComplaintsSubmit}
                disabled={selectedComplaints.length === 0}
                className={`px-6 py-2 rounded-lg flex items-center ${
                  selectedComplaints.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Devam Et
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsWrong;