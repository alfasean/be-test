const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 4000;  

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,  
  user: process.env.MYSQL_ADDON_USER,  
  password: process.env.MYSQL_ADDON_PASSWORD,  
  database: process.env.MYSQL_ADDON_DB,
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.post('/packages', (req, res) => {
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `INSERT INTO paket (nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status], (err, result) => {
    if (err) throw err;
    res.send({ id: result.insertId });
  });
});

app.get('/packages', (req, res) => {
  const query = `SELECT * FROM paket`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/packages/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM paket WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/packages/:id', (req, res) => {
  const { id } = req.params;
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `UPDATE paket SET nama_pengirim = ?, alamat_pengirim = ?, nama_penerima = ?, alamat_penerima = ?, ekspedisi_id = ?, status = ? WHERE id = ?`;
  db.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/packages/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM paket WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send("Data deleted successfully");
  });
});

app.get('/reports', (req, res) => {
  const { status, startDate, endDate } = req.query;
  let query = `SELECT * FROM paket WHERE 1=1`;
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
  const query = `SELECT * FROM ekspedisi`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); 
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
