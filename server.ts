import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'scholarly-secret-key-123';
const PORT = 3000;

// Database Initialization
const db = new Database('database.sqlite');
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    media_url TEXT,
    media_type TEXT, -- 'youtube', 'facebook', 'image'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default admin if not exists
const adminCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
  
  // Seed default settings
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('contact_email', 'engr.rahman212@gmail.com');
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('bio', 'Maulana Nasir Uddin Azhari is a renowned scholar from Al-Azhar University, Egypt.');
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Auth Middlware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  });

  // Blogs
  app.get('/api/blogs', (req, res) => {
    const blogs = db.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
    res.json(blogs);
  });

  app.post('/api/blogs', authenticateToken, (req, res) => {
    const { title, content, media_url, media_type } = req.body;
    const result = db.prepare('INSERT INTO blogs (title, content, media_url, media_type) VALUES (?, ?, ?, ?)').run(title, content, media_url, media_type);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    const items = db.prepare('SELECT * FROM gallery ORDER BY created_at DESC').all();
    res.json(items);
  });

  app.post('/api/gallery', authenticateToken, (req, res) => {
    const { title, image_url, category } = req.body;
    const result = db.prepare('INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)').run(title, image_url, category);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all() as any[];
    const result: any = {};
    settings.forEach(s => result[s.key] = s.value);
    res.json(result);
  });

  app.post('/api/settings', authenticateToken, (req, res) => {
    const entries = Object.entries(req.body);
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const updateMany = db.transaction((data) => {
      for (const [key, value] of data) stmt.run(key, value);
    });
    updateMany(entries);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for dev mode
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
