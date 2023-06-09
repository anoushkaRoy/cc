const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'blogdb',
  waitForConnections: true,
  connectionLimit: 10,
});

// Middleware
app.use(express.json());

// Routes
// Create a blog
app.post('/blogs', (req, res) => {
  const { author, content, heading, date } = req.body;

  pool.query(
    'INSERT INTO blogs (author, content, heading, date) VALUES (?, ?, ?, ?)',
    [author, content, heading, date],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error!!' });
      } else {
        res.json({ message: 'Blog created successfully!!' });
      }
    }
  );
});

// Read all blogs
app.get('/blogs', (req, res) => {
  pool.query('SELECT * FROM blogs ORDER BY date DESC', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error!!' });
    } else {
      res.json(results);
    }
  });
});

// Read a specific blog
app.get('/blogs/:id', (req, res) => {
  const { id } = req.params;

  pool.query('SELECT * FROM blogs WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error!!' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Update a blog
app.put('/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { author, content, heading, date } = req.body;

  pool.query(
    'UPDATE blogs SET author = ?, content = ?, heading = ?, date = ? WHERE id = ?',
    [author, content, heading, date, id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Blog not found' });
      } else {
        res.json({ message: 'Blog updated successfully' });
      }
    }
  );
});

// Delete a blog
app.delete('/blogs/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM blogs WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.json({ message: 'Blog deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
