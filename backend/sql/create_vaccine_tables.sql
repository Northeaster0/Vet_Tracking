USE Vet_Tracking_System;

-- Aşı türleri tablosu
CREATE TABLE IF NOT EXISTS VaccineType (
  VaccineTypeID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Description TEXT,
  Duration INT NOT NULL COMMENT 'Aşı süresi (gün cinsinden)',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Aşı kayıtları tablosu
CREATE TABLE IF NOT EXISTS VaccineRecord (
  VaccineRecordID INT AUTO_INCREMENT PRIMARY KEY,
  AnimalID INT NOT NULL,
  VaccineTypeID INT NOT NULL,
  VeterinaryID INT NOT NULL,
  Date DATE NOT NULL,
  NextDate DATE NOT NULL,
  Notes TEXT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (AnimalID) REFERENCES Animal(AnimalID),
  FOREIGN KEY (VaccineTypeID) REFERENCES VaccineType(VaccineTypeID),
  FOREIGN KEY (VeterinaryID) REFERENCES Veterinary(VeterinaryID)
) ENGINE=InnoDB;

-- Örnek aşı türleri
INSERT INTO VaccineType (Name, Description, Duration) VALUES
('Kuduz Aşısı', 'Yıllık tekrar gereklidir', 365),
('Karma Aşı', 'Yıllık tekrar gereklidir', 365),
('Leptospirosis Aşısı', '6 aylık tekrar gereklidir', 180),
('Bordetella Aşısı', '6 aylık tekrar gereklidir', 180),
('Coronavirus Aşısı', '6 aylık tekrar gereklidir', 180); 