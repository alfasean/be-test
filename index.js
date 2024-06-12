const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 4000;  

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const checkConnection = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).send('Error connecting to database');
    } else {
      req.connection = connection;
      next();
    }
  });
};

app.post('/packages', checkConnection, (req, res) => {
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `INSERT INTO paket (nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status) VALUES (?, ?, ?, ?, ?, ?)`;
  req.connection.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status], (err, result) => {
    req.connection.release();
    if (err) {
      console.error('Error inserting package:', err);
      res.status(500).send('Error inserting package');
    } else {
      res.send({ id: result.insertId });
    }
  });
});

app.get('/packages', checkConnection, (req, res) => {
  const query = `SELECT paket.*, ekspedisi.nama AS nama_ekspedisi FROM paket JOIN ekspedisi ON paket.ekspedisi_id = ekspedisi.id`;
  req.connection.query(query, (err, results) => {
    req.connection.release();
    if (err) {
      console.error('Error fetching packages:', err);
      res.status(500).send('Error fetching packages');
    } else {
      res.send(results);
    }
  });
});

app.get('/packages/:id', checkConnection, (req, res) => {
  const { id } = req.params;
  const query = `SELECT paket.*, ekspedisi.nama AS nama_ekspedisi FROM paket JOIN ekspedisi ON paket.ekspedisi_id = ekspedisi.id WHERE paket.id = ?`;
  req.connection.query(query, [id], (err, result) => {
    req.connection.release();
    if (err) {
      console.error('Error fetching package:', err);
      res.status(500).send('Error fetching package');
    } else {
      res.send(result);
    }
  });
});

app.put('/packages/:id', checkConnection, (req, res) => {
  const { id } = req.params;
  const { nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status } = req.body;
  const query = `UPDATE paket SET nama_pengirim = ?, alamat_pengirim = ?, nama_penerima = ?, alamat_penerima = ?, ekspedisi_id = ?, status = ? WHERE id = ?`;
  req.connection.query(query, [nama_pengirim, alamat_pengirim, nama_penerima, alamat_penerima, ekspedisi_id, status, id], (err, result) => {
    req.connection.release();
    if (err) {
      console.error('Error updating package:', err);
      res.status(500).send('Error updating package');
    } else {
      res.send(result);
    }
  });
});

app.delete('/packages/:id', checkConnection, (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM paket WHERE id = ?`;
  req.connection.query(query, [id], (err, result) => {
    req.connection.release();
    if (err) {
      console.error('Error deleting package:', err);
      res.status(500).send('Error deleting package');
    } else {
      res.send("Data deleted successfully");
    }
  });
});

app.get('/reports', checkConnection, (req, res) => {
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

  req.connection.query(query, queryParams, (err, results) => {
    req.connection.release();
    if (err) {
      console.error('Error fetching reports:', err);
      res.status(500).send('Error fetching reports');
    } else {
      res.send(results);
    }
  });
});

app.get('/expeditions', checkConnection, (req, res) => {
  const query = `SELECT * FROM ekspedisi`;
  req.connection.query(query, (err, results) => {
    req.connection.release();
    if (err) {
      console.error('Error fetching expeditions:', err);
      res.status(500).send('Error fetching expeditions');
    } else {
      res.send(results);
    }
  });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
