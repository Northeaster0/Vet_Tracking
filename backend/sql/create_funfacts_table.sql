USE Vet_Tracking_System;

CREATE TABLE IF NOT EXISTS FunFacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  header VARCHAR(255) NOT NULL,
  fact TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert some sample funfacts
INSERT INTO FunFacts (header, fact) VALUES
('Kedilerin Dil Yapısı', 'Kedilerin dilleri tırtıklıdır ve bu sayede suyu daha kolay içebilirler.'),
('Köpeklerin Koku Alma Duyusu', 'Köpeklerin koku alma duyusu insanlardan 10.000 kat daha güçlüdür.'),
('Hayvanların Kalp Atışı', 'Farelerin kalp atışı dakikada 500-600 kez atabilir.'),
('Kuşların Görüş Yeteneği', 'Baykuşlar kafalarını 270 derece döndürebilirler.'),
('Balıkların Hafızası', 'Balıkların 3 saniyelik hafızası olduğu bir efsanedir, aslında aylarca hatırlayabilirler.'); 