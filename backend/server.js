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

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
}); 