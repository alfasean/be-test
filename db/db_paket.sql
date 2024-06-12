CREATE DATABASE db_paket;

USE db_paket;

CREATE TABLE Ekspedisi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL
);

CREATE TABLE Paket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pengirim VARCHAR(255) NOT NULL,
  alamat_pengirim TEXT NOT NULL,
  nama_penerima VARCHAR(255) NOT NULL,
  alamat_penerima TEXT NOT NULL,
  ekspedisi_id INT,
  tanggal_pembuatan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Dikirim', 'Dalam Perjalanan', 'Tiba di Tujuan') NOT NULL,
  FOREIGN KEY (ekspedisi_id) REFERENCES Ekspedisi(id)
);
