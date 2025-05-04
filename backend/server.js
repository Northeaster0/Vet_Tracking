const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Upload klasörü ve ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reports/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Sadece PDF veya Word dosyası yükleyebilirsiniz!'));
  }
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Veritabanı bağlantısı başarılı!', solution: rows[0].solution });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: 'Veritabanı bağlantı hatası' });
  }
});

// Raporları kategoriye ve hayvana göre listele
app.get('/api/reports', async (req, res) => {
  const { animalId, type } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM Report WHERE AnimalID = ? AND type = ? ORDER BY date DESC', [animalId, type]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Raporlar getirilemedi' });
  }
});

// Rapor yükle
app.post('/api/reports/upload', upload.single('file'), async (req, res) => {
  const { animalId, type, title, date } = req.body;
  try {
    const fileUrl = `/uploads/reports/${req.file.filename}`;
    await db.query(
      'INSERT INTO Report (AnimalID, title, date, type, fileUrl) VALUES (?, ?, ?, ?, ?)',
      [animalId, title, date, type, fileUrl]
    );
    res.json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Rapor yüklenemedi' });
  }
});

// Yeni rapor ekleme endpoint'i
app.post('/api/reports', async (req, res) => {
  try {
    const { title, date, type, fileUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO Report (title, date, type, fileUrl) VALUES (?, ?, ?, ?)',
      [title, date, type, fileUrl]
    );
    res.json({ id: result.insertId, message: 'Rapor başarıyla eklendi' });
  } catch (error) {
    console.error('Rapor ekleme hatası:', error);
    res.status(500).json({ error: 'Rapor eklenemedi' });
  }
});

app.post('/api/doctor-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT * FROM Veterinary WHERE Email = ? AND Password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, doctor: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı' });
    }
  } catch (error) {
    console.error("DOCTOR LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: 'Sunucu hatası', error: error.message });
  }
});

app.post('/api/patient-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT * FROM Owner WHERE Email = ? AND Password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, owner: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

app.get('/api/medicine-stocks', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ms.MedicineStockID as id, m.Name as name, ms.Quantity as quantity
      FROM MedicineStock ms
      JOIN Medicine m ON ms.MedicineID = m.MedicineID
    `);
    // Her ilaca sabit fiyat ekle
    const result = rows.map((item, idx) => ({
      ...item,
      PurchasePrice: 50 + (idx % 5) * 10, // örnek: 50, 60, 70, 80, 90
      SalePrice: 100 + (idx % 5) * 15 // örnek: 100, 115, 130, 145, 160
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'İlaç stokları getirilemedi' });
  }
});

app.post('/api/medicine-stocks/add', async (req, res) => {
  const { medicineId, quantity } = req.body;
  try {
    // Önce bu ilacın MedicineStock kaydı var mı kontrol et
    const [rows] = await db.query('SELECT * FROM MedicineStock WHERE MedicineID = ?', [medicineId]);
    if (rows.length > 0) {
      // Varsa miktarı artır
      await db.query(
        'UPDATE MedicineStock SET Quantity = Quantity + ? WHERE MedicineID = ?',
        [quantity, medicineId]
      );
    } else {
      // Yoksa yeni kayıt ekle (örnek olarak ClinicID=1, LastUpdated=NULL, BatchNumber=NULL, ExpiryDate=NULL)
      await db.query(
        'INSERT INTO MedicineStock (ClinicID, MedicineID, Quantity) VALUES (?, ?, ?)',
        [1, medicineId, quantity]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stok eklenemedi' });
  }
});

app.post('/api/medicine-stocks/reduce', async (req, res) => {
  const { medicineId, quantity } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE MedicineStock SET Quantity = GREATEST(Quantity - ?, 0) WHERE MedicineID = ?',
      [quantity, medicineId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stok eksiltilemedi' });
  }
});

app.get('/api/medicines', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT MedicineID as id, Name as name FROM Medicine');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'İlaçlar getirilemedi' });
  }
});

app.post('/api/owners', async (req, res) => {
  const { identityNo, name, phoneNo, email, address } = req.body;
  try {
    // İsim bilgisini ad ve soyad olarak ayır
    const [firstName, ...lastNameArr] = name.trim().split(' ');
    const lastName = lastNameArr.join(' ');
    // 6 haneli rastgele şifre oluştur
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const [result] = await db.query(
      'INSERT INTO Owner (FName, LName, Email, Password, Phone, Address, NationalID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, password, phoneNo, address, identityNo]
    );
    res.json({ success: true, id: result.insertId, password });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Müşteri eklenemedi' });
  }
});

// Tüm müşterileri dönen endpoint
app.get('/api/owners', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT OwnerID, FName, LName FROM Owner');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Müşteriler getirilemedi' });
  }
});

// Tüm hayvan tür ve ırklarını dönen endpoint
app.get('/api/animal-types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT AnimalTypeID, Species, Breed FROM AnimalType');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Hayvan türleri getirilemedi' });
  }
});

// Yeni hayvan ekleme endpointi
app.post('/api/animals', async (req, res) => {
  const { ownerId, animalTypeId, name, gender, dateOfBirth, weight, color, passportNumber } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Animal (OwnerID, AnimalTypeID, Name, Gender, DateOfBirth, Weight, Color, PassportNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ownerId, animalTypeId, name, gender, dateOfBirth, weight, color, passportNumber]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Hayvan eklenemedi', error: error.message });
  }
});

app.get('/api/funfacts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM FunFacts ORDER BY RAND()');
    res.json(rows);
  } catch (error) {
    console.error('Funfacts getirme hatası:', error);
    res.status(500).json({ error: 'Funfacts getirilemedi' });
  }
});

// Hayvanları detaylı (tür ve ırk ile) getir
app.get('/api/animals/with-details', async (req, res) => {
  const { ownerId, animalId } = req.query;
  try {
    let query = `
      SELECT a.*, at.Species as Type, at.Breed, o.FName as OwnerFName, o.LName as OwnerLName
      FROM Animal a
      JOIN AnimalType at ON a.AnimalTypeID = at.AnimalTypeID
      JOIN Owner o ON a.OwnerID = o.OwnerID
    `;
    const params = [];
    if (animalId) {
      query += ' WHERE a.AnimalID = ?';
      params.push(animalId);
    } else if (ownerId) {
      query += ' WHERE a.OwnerID = ?';
      params.push(ownerId);
    }
    const [rows] = await db.query(query, params);
    res.json(animalId ? rows[0] : rows);
  } catch (error) {
    res.status(500).json({ error: 'Hayvanlar getirilemedi' });
  }
});

// Belirli bir hayvanın operasyonlarını getir
app.get('/api/operations', async (req, res) => {
  const { animalId } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM Operation WHERE AnimalID = ? ORDER BY CreatedAt DESC', [animalId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Operasyonlar getirilemedi' });
  }
});

// Yeni operasyon ekle
app.post('/api/operations', async (req, res) => {
  const { animalId, description, date } = req.body;
  try {
    await db.query('INSERT INTO Operation (AnimalID, OpDetail, CreatedAt) VALUES (?, ?, ?)', [animalId, description, date]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Operasyon eklenemedi', error: error.message });
  }
});

// Belirli bir doktorun en son operasyonlarını getir
app.get('/api/operations/doctor', async (req, res) => {
  const { doctor } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT o.*, a.Name as animalName
      FROM Operation o
      JOIN Animal a ON o.AnimalID = a.AnimalID
      WHERE o.Doctor = ?
      ORDER BY o.CreatedAt DESC
      LIMIT 20
    `, [doctor]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Doktorun operasyonları getirilemedi' });
  }
});

// Hayvan silme endpointi
app.delete('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Animal WHERE AnimalID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Hayvan silinemedi', error: error.message });
  }
});

app.get('/api/diseases', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DiseaseID as id, Name, Description, Category FROM Disease');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Hastalıklar getirilemedi' });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  const { VeterinaryID, AnimalID, Method, Dose, Frequency, medicineId } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Prescription (VeterinaryID, AnimalID, Method, Dose, Frequency) VALUES (?, ?, ?, ?, ?)',
      [VeterinaryID, AnimalID, Method, Dose, Frequency]
    );
    const prescriptionId = result.insertId;
    // Medicine-Prescription eşleşmesini ekle
    if (medicineId) {
      await db.query(
        'INSERT INTO medicine_prescription (MedicineID, PrescriptionID) VALUES (?, ?)',
        [medicineId, prescriptionId]
      );
      await db.query(
        'UPDATE MedicineStock SET Quantity = GREATEST(Quantity - 1, 0) WHERE MedicineID = ?',
        [medicineId]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reçete eklenemedi', error: error.message });
  }
});

app.get('/api/prescriptions', async (req, res) => {
  const { animalId } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT p.PrescriptionID, m.Name as MedicineName, p.Method, p.Dose, p.Frequency, p.VeterinaryID
       FROM Prescription p
       LEFT JOIN medicine_prescription mp ON p.PrescriptionID = mp.PrescriptionID
       LEFT JOIN medicine m ON mp.MedicineID = m.MedicineID
       WHERE p.AnimalID = ?
       ORDER BY p.PrescriptionID DESC`,
      [animalId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Reçeteler getirilemedi' });
  }
});

app.delete('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Önce ilgili ilacın ID'sini al
    const [medicineRows] = await db.query(
      'SELECT MedicineID FROM medicine_prescription WHERE PrescriptionID = ?',
      [id]
    );
    
    // Eğer ilaç varsa stok miktarını artır
    if (medicineRows.length > 0) {
      const medicineId = medicineRows[0].MedicineID;
      await db.query(
        'UPDATE MedicineStock SET Quantity = Quantity + 1 WHERE MedicineID = ?',
        [medicineId]
      );
    }

    // Reçeteyi sil
    await db.query('DELETE FROM medicine_prescription WHERE PrescriptionID = ?', [id]);
    await db.query('DELETE FROM Prescription WHERE PrescriptionID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reçete silinemedi', error: error.message });
  }
});

// Aşı türlerini getir
app.get('/api/vaccine-types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT VaccineTypeID as id, Name, Description, Duration FROM VaccineType');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Aşı türleri getirilemedi' });
  }
});

// Hayvanın aşı kayıtlarını getir
app.get('/api/vaccine-records', async (req, res) => {
  const { animalId } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT 
        vr.VaccineRecordID,
        vt.Name as vaccineName,
        vr.Date,
        vr.NextDate,
        vr.Notes,
        v.Name as veterinaryName
      FROM VaccineRecord vr
      JOIN VaccineType vt ON vr.VaccineTypeID = vt.VaccineTypeID
      JOIN Veterinary v ON vr.VeterinaryID = v.VeterinaryID
      WHERE vr.AnimalID = ?
      ORDER BY vr.Date DESC
    `, [animalId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Aşı kayıtları getirilemedi' });
  }
});

// Yeni aşı kaydı ekle
app.post('/api/vaccine-records', async (req, res) => {
  const { animalId, vaccineTypeId, date, notes } = req.body;
  try {
    // Veteriner bilgisini al
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    const veterinaryId = doctor.VeterinaryID || doctor.id || 1;

    // Aşı türünün süresini al
    const [vaccineType] = await db.query(
      'SELECT Duration FROM VaccineType WHERE VaccineTypeID = ?',
      [vaccineTypeId]
    );

    if (!vaccineType.length) {
      return res.status(400).json({ error: 'Geçersiz aşı türü' });
    }

    // Sonraki aşı tarihini hesapla
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + vaccineType[0].Duration);

    // Aşı kaydını ekle
    await db.query(
      'INSERT INTO VaccineRecord (AnimalID, VaccineTypeID, VeterinaryID, Date, NextDate, Notes) VALUES (?, ?, ?, ?, ?, ?)',
      [animalId, vaccineTypeId, veterinaryId, date, nextDate, notes]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Aşı kaydı eklenemedi' });
  }
});

// Aşı kaydını sil
app.delete('/api/vaccine-records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM VaccineRecord WHERE VaccineRecordID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Aşı kaydı silinemedi' });
  }
});

// Hayvana yapılmamış aşıları getir
app.get('/api/available-vaccines/:animalId', async (req, res) => {
  const { animalId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM vaccine
       WHERE VaccineID NOT IN (
         SELECT VaccineID FROM vaccine_animal WHERE AnimalID = ?
       )`,
      [animalId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Aşılar getirilemedi' });
  }
});

// Hayvana yapılan aşıları getir
app.get('/api/animal-vaccines/:animalId', async (req, res) => {
  const { animalId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT va.VaccineForAnimalID, v.Name, v.Type, v.Description, va.VaccineID
       FROM vaccine_animal va
       JOIN vaccine v ON va.VaccineID = v.VaccineID
       WHERE va.AnimalID = ?`,
      [animalId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Hayvanın aşıları getirilemedi' });
  }
});

// Hayvana aşı ekle
app.post('/api/animal-vaccines', async (req, res) => {
  const { animalId, vaccineId } = req.body;
  try {
    // Aşı kaydını ekle
    await db.query(
      'INSERT INTO vaccine_animal (AnimalID, VaccineID) VALUES (?, ?)',
      [animalId, vaccineId]
    );
    // Stoktan 1 düş
    await db.query(
      'UPDATE vaccinestock SET Quantity = GREATEST(Quantity - 1, 0) WHERE VaccineID = ?',
      [vaccineId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Aşı eklenemedi' });
  }
});

// Aşı stoklarını getir
app.get('/api/vaccine-stocks', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT vs.VaccineStockID as id, v.Name as name, vs.Quantity as quantity
      FROM vaccinestock vs
      JOIN vaccine v ON vs.VaccineID = v.VaccineID
    `);
    // Her aşıya sabit fiyat ekle
    const result = rows.map((item, idx) => ({
      ...item,
      PurchasePrice: 30 + (idx % 4) * 8, // örnek: 30, 38, 46, 54
      SalePrice: 60 + (idx % 4) * 12 // örnek: 60, 72, 84, 96
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Aşı stokları getirilemedi' });
  }
});

// Aşı stoğu ekle
app.post('/api/vaccine-stocks/add', async (req, res) => {
  const { vaccineId, quantity } = req.body;
  try {
    // Önce bu aşının stok kaydı var mı kontrol et
    const [rows] = await db.query('SELECT * FROM vaccinestock WHERE VaccineID = ?', [vaccineId]);
    if (rows.length > 0) {
      // Varsa miktarı artır
      await db.query(
        'UPDATE vaccinestock SET Quantity = Quantity + ? WHERE VaccineID = ?',
        [quantity, vaccineId]
      );
    } else {
      // Yoksa yeni kayıt ekle (örnek olarak ClinicID=1, LastUpdated=NULL, BatchNumber=NULL, ExpiryDate=NULL)
      await db.query(
        'INSERT INTO vaccinestock (ClinicID, VaccineID, Quantity) VALUES (?, ?, ?)',
        [1, vaccineId, quantity]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Aşı stoğu eklenemedi' });
  }
});

// Aşı stoğu eksilt
app.post('/api/vaccine-stocks/reduce', async (req, res) => {
  const { vaccineId, quantity } = req.body;
  try {
    await db.query(
      'UPDATE vaccinestock SET Quantity = GREATEST(Quantity - ?, 0) WHERE VaccineID = ?',
      [quantity, vaccineId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Aşı stoğu eksiltilemedi' });
  }
});

// Tüm aşıları getir
app.get('/api/vaccines', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT VaccineID as id, Name FROM vaccine');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Aşılar getirilemedi' });
  }
});

// Hayvan bilgilerini güncelle
app.put('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gender, dateOfBirth, weight, color, passportNumber, animalTypeId } = req.body;
  try {
    await db.query(
      `UPDATE Animal SET 
        Name = ?, 
        Gender = ?, 
        DateOfBirth = ?, 
        Weight = ?, 
        Color = ?, 
        PassportNumber = ?, 
        AnimalTypeID = ?
      WHERE AnimalID = ?`,
      [name, gender, dateOfBirth, weight, color, passportNumber, animalTypeId, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Hayvan bilgileri güncellenemedi', error: error.message });
  }
});

// Hayvana yapılan aşıyı sil
app.delete('/api/animal-vaccines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Önce VaccineID'yi bul
    const [rows] = await db.query('SELECT VaccineID FROM vaccine_animal WHERE VaccineForAnimalID = ?', [id]);
    if (rows.length > 0) {
      const vaccineId = rows[0].VaccineID;
      // Stok 1 artır
      await db.query('UPDATE vaccinestock SET Quantity = Quantity + 1 WHERE VaccineID = ?', [vaccineId]);
    }
    // Kaydı sil
    await db.query('DELETE FROM vaccine_animal WHERE VaccineForAnimalID = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Aşı kaydı silinemedi' });
  }
});

// Klasörden rapor dosyalarını listele
app.get('/api/reports/files', (req, res) => {
  fs.readdir('uploads/reports', (err, files) => {
    if (err) return res.status(500).json({ error: 'Dosyalar listelenemedi' });
    // Sadece .pdf, .doc, .docx dosyalarını döndür
    const filtered = files.filter(f => /\.(pdf|docx?)$/i.test(f));
    res.json(filtered.map(filename => ({
      title: filename,
      fileUrl: `/uploads/reports/${filename}`
    })));
  });
});

// Hayvana ait anamnezleri getir
app.get('/api/anamnezs', async (req, res) => {
  const { animalId } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM Anamnez WHERE AnimalID = ? ORDER BY CreatedAt DESC', [animalId]);
    res.json(rows);
  } catch (error) {
    console.error('Anamnez listeleme hatası:', error);
    res.status(500).json({ error: 'Anamnezler getirilemedi' });
  }
});

// Yeni anamnez ekle
app.post('/api/anamnezs', async (req, res) => {
  const { animalId, veterinaryId, detail } = req.body;
  console.log('Gelen veri:', { animalId, veterinaryId, detail });
  if (!animalId || !veterinaryId || !detail) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi!' });
  }
  try {
    await db.query(
      'INSERT INTO Anamnez (AnimalID, VeterinaryID, Detail, CreatedAt) VALUES (?, ?, ?, NOW())',
      [animalId, veterinaryId, detail]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Anamnez ekleme hatası:', error);
    res.status(500).json({ error: 'Anamnez eklenemedi' });
  }
});

// Belirli bir owner'ı getir
app.get('/api/owners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Owner WHERE OwnerID = ?', [id]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ error: 'Müşteri bulunamadı' });
  } catch (error) {
    res.status(500).json({ error: 'Müşteri getirilemedi' });
  }
});

// Belirli bir owner'ın hayvanlarını getir
app.get('/api/animals', async (req, res) => {
  const { ownerId } = req.query;
  if (!ownerId) return res.status(400).json({ error: 'ownerId gerekli' });
  try {
    const [rows] = await db.query('SELECT * FROM Animal WHERE OwnerID = ?', [ownerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Hayvanlar getirilemedi' });
  }
});

// Alerjik hastalıkları getir
app.get('/api/allergy-diseases', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT Name FROM Disease WHERE Category = 'Alerjik'");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Alerji hastalıkları getirilemedi' });
  }
});

// Hayvanın alerjisini güncelle
app.put('/api/animals/:id/allergies', async (req, res) => {
  const { id } = req.params;
  const { allergies } = req.body;
  try {
    await db.query('UPDATE Animal SET Allergies = ? WHERE AnimalID = ?', [allergies, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Alerji güncellenemedi' });
  }
});

// Owner bilgilerini güncelle
app.put('/api/owners/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, email, address } = req.body;
  try {
    await db.query(
      'UPDATE Owner SET Phone = ?, Email = ?, Address = ? WHERE OwnerID = ?',
      [phone, email, address, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Profil güncellenemedi' });
  }
});

// Hayvanın geçmişte olduğu aşıları dönen endpoint
app.get('/api/animals/:animalId/vaccines', async (req, res) => {
  const { animalId } = req.params;
  try {
    // En son yapılan aşı en başta olacak şekilde sıralanıyor
    const [rows] = await db.query(`
      SELECT va.VaccineForAnimalID, v.Name
      FROM vaccine_animal va
      JOIN vaccine v ON va.VaccineID = v.VaccineID
      WHERE va.AnimalID = ?
      ORDER BY va.VaccineForAnimalID DESC
    `, [animalId]);
    // İlk aşıya "yapıldı", diğerlerine "yaklaşıyor" etiketi ekle
    const result = rows.map((row, idx) => ({
      ...row,
      status: idx === 0 ? 'Yapıldı' : 'Yaklaşıyor'
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Aşılar getirilemedi' });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
}); 