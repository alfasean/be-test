const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'db_paket'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.post('/packages', (req, res) => {
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `INSERT INTO Paket (nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status], (err, result) => {
    if (err) throw err;
    res.send({ id: result.insertId });
  });
});

app.get('/packages', (req, res) => {
  const query = `SELECT * FROM Paket`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/packages/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Paket WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/packages/:id', (req, res) => {
  const { id } = req.params;
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `UPDATE Paket SET nama_pengirim = ?, alamat_pengirim = ?, nama_penerima = ?, alamat_penerima = ?, ekspedisi_id = ?, status = ? WHERE id = ?`;
  db.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/packages/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Paket WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send("Data deleted successfully");
  });
});

app.get('/reports', (req, res) => {
  const { status, startDate, endDate } = req.query;
  let query = `SELECT * FROM Paket WHERE 1=1`;
  const queryParams = [];

  if (status) {
    query += ` AND status = ?`;
    queryParams.push(status);
  }

  if (startDate) {
    query += ` AND tanggal_pembuatan >= ?`;
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ` AND tanggal_pembuatan <= ?`;
    queryParams.push(endDate);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/expeditions', (req, res) => {
  const query = `SELECT * FROM Ekspedisi`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
