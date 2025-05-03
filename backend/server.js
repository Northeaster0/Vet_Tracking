const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// Raporlar endpoint'i
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Report');
    res.json(rows);
  } catch (error) {
    console.error('Raporlar getirme hatası:', error);
    res.status(500).json({ error: 'Raporlar getirilemedi' });
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
    res.json(rows);
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

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
}); 