import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
export const base = '/undangan/angklung-pride';
const categories = {
  vvip: { label: 'VVIP', arrival: '17.30' },
  vip: { label: 'VIP', arrival: '18.00' },
  'vip-biasa': { label: 'VIP biasa', arrival: '18.00' },
  reguler: { label: 'Reguler', arrival: '18.00' },
};
const cleanName = value => typeof value === 'string' ? value.normalize('NFKC').replace(/\s+/gu, ' ').trim() : '';
const validName = name => name.length >= 2 && name.length <= 160 && !/[\p{Cc}\p{Cf}]/u.test(name);
const nameSlug = name => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tamu';
const hash = value => createHash('sha256').update(value).digest('hex');
const token = () => randomBytes(32).toString('hex');
const cookieValue = (request, name) => (request.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${name}=`))?.slice(name.length + 1) || '';

export function invitationServer({ database, password, origin, secure = true }) {
  if (!password || password.length < 16) throw new Error('ADMIN_PASSWORD must contain at least 16 characters.');
  if (!origin) throw new Error('PUBLIC_ORIGIN is required.');
  mkdirSync(dirname(database), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(database);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 160),
      name_key TEXT NOT NULL UNIQUE,
      attendance TEXT NOT NULL CHECK(attendance IN ('hadir','berhalangan')),
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      category TEXT NOT NULL CHECK(category IN ('vvip','vip','vip-biasa','reguler')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Add a readable alias while retaining invitation IDs and existing RSVP keys.
  db.exec('BEGIN IMMEDIATE');
  try {
    if (!db.prepare('PRAGMA table_info(invitations)').all().some(column => column.name === 'slug')) db.exec('ALTER TABLE invitations ADD COLUMN slug TEXT');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS invitations_slug_unique ON invitations(slug)');
    const unusedSlug = name => {
      const rootSlug = nameSlug(name); let slug = rootSlug; let suffix = 2;
      while (db.prepare('SELECT 1 FROM invitations WHERE slug=?').get(slug)) slug = `${rootSlug}-${suffix++}`;
      return slug;
    };
    for (const invite of db.prepare('SELECT id,name FROM invitations WHERE slug IS NULL ORDER BY rowid').all()) {
      db.prepare('UPDATE invitations SET slug=? WHERE id=?').run(unusedSlug(invite.name), invite.id);
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); db.close(); throw error; }
  const staticFiles = new Map([
    ['/', ['index.html', 'text/html; charset=utf-8']],
    ['/dashboard', ['dashboard.html', 'text/html; charset=utf-8']],
    ['/style.css', ['style.css', 'text/css; charset=utf-8']],
    ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
    ['/dashboard.js', ['dashboard.js', 'text/javascript; charset=utf-8']],
    ['/flyer.jpg', ['flyer.jpg', 'image/jpeg']],
  ].map(([path, [file, type]]) => [path, { body: readFileSync(resolve(root, 'public', file)), type }]));
  const cookie = (name, value, maxAge) => `${name}=${value}; Path=${base}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
  const admin = req => {
    const value = cookieValue(req, 'pride_admin');
    return /^[a-f0-9]{64}$/.test(value) && !!db.prepare('SELECT 1 FROM sessions WHERE token_hash=? AND expires_at>?').get(hash(value), Date.now());
  };
  const rateLimit = (key, limit, windowMs) => {
    const now = Date.now();
    db.prepare('DELETE FROM rate_limits WHERE reset_at < ?').run(now);
    const entry = db.prepare(`INSERT INTO rate_limits (key,count,reset_at) VALUES (?,1,?)
      ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count`).get(key, now + windowMs);
    return entry.count <= limit;
  };
  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); };
    try {
      const url = new URL(req.url, origin);
      if (url.pathname === base || url.pathname === `${base}/dashboard/`) {
        res.writeHead(308, { Location: (url.pathname === base ? `${base}/` : `${base}/dashboard`) + url.search }); return res.end();
      }
      if (!url.pathname.startsWith(`${base}/`)) return json(404, { error: 'Halaman tidak ditemukan.' });
      const path = url.pathname.slice(base.length);
      if (['GET', 'HEAD'].includes(req.method) && staticFiles.has(path)) {
        const file = staticFiles.get(path);
        res.writeHead(200, { 'Content-Type': file.type, 'Content-Length': file.body.length }); return res.end(req.method === 'HEAD' ? undefined : file.body);
      }
      if (req.method === 'GET' && path === '/api/responses') {
        if (!admin(req)) return json(401, { error: 'Silakan masuk dashboard.' });
        const invitations = db.prepare('SELECT id, name, category, slug FROM invitations ORDER BY rowid DESC').all();
        const issuedIds = new Set(invitations.map(invite => hash(`invitation:${invite.id}`)));
        const responses = db.prepare('SELECT id, name, attendance FROM responses ORDER BY updated_at DESC, rowid DESC').all();
        return json(200, { responses: [
          ...invitations.map(invite => ({ name: invite.name, attendance: responses.find(r => r.id === hash(`invitation:${invite.id}`))?.attendance || null,
            category: categories[invite.category].label, arrival: categories[invite.category].arrival, url: `${origin}${base}/?kepada=${invite.slug}&kategori=${categories[invite.category].label}&jam=${categories[invite.category].arrival}` })),
          ...responses.filter(response => !issuedIds.has(response.id)).map(({ name, attendance }) => ({ name, attendance })),
        ] });
      }
      if (req.method === 'GET' && path === '/api/invitation') {
        const invite = url.searchParams.has('kepada')
          ? db.prepare('SELECT id, name, category, slug FROM invitations WHERE slug=?').get(url.searchParams.get('kepada'))
          : db.prepare('SELECT id, name, category, slug FROM invitations WHERE id=?').get(url.searchParams.get('id') || '');
        if (!invite) return json(404, { error: 'Undangan tidak ditemukan. Silakan periksa tautan dari panitia.' });
        const response = db.prepare('SELECT name, attendance FROM responses WHERE id=?').get(hash(`invitation:${invite.id}`));
        return json(200, { invitation: { ...invite, ...categories[invite.category] }, response: response || null });
      }
      if (req.method === 'GET' && path === '/api/me') {
        let guestToken = cookieValue(req, 'pride_guest');
        if (!/^[a-f0-9]{64}$/.test(guestToken)) {
          guestToken = token(); res.setHeader('Set-Cookie', cookie('pride_guest', guestToken, 86400 * 90));
        }
        const response = db.prepare('SELECT name, attendance FROM responses WHERE id=?').get(hash(guestToken));
        return json(200, { response: response || null });
      }
      if (req.method !== 'POST' || !['/api/rsvp', '/api/login', '/api/logout', '/api/invitations'].includes(path)) return json(404, { error: 'Halaman tidak ditemukan.' });
      if (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json')) return json(403, { error: 'Permintaan tidak diizinkan.' });
      const ip = req.socket.remoteAddress === '127.0.0.1' || req.socket.remoteAddress === '::ffff:127.0.0.1' ? (req.headers['x-real-ip'] || req.socket.remoteAddress) : req.socket.remoteAddress;
      if (!rateLimit(`${path}:${ip}`, path === '/api/login' ? 10 : 60, 15 * 60_000)) return json(429, { error: 'Terlalu banyak percobaan. Silakan coba 15 menit lagi.' });
      let body = ''; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 2048) return json(413, { error: 'Data terlalu panjang.' });
        body += chunk.toString();
      }
      let input;
      try { input = JSON.parse(body); } catch { return json(400, { error: 'Data tidak valid.' }); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, { error: 'Data tidak valid.' });
      if (path === '/api/login') {
        if (typeof input.password !== 'string' || !timingSafeEqual(Buffer.from(hash(input.password)), Buffer.from(hash(password)))) return json(401, { error: 'Kata sandi tidak sesuai.' });
        const value = token();
        db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
        db.prepare('INSERT INTO sessions VALUES (?,?)').run(hash(value), Date.now() + 12 * 3600_000);
        res.setHeader('Set-Cookie', cookie('pride_admin', value, 12 * 3600));
        return json(200, { ok: true });
      }
      if (path === '/api/logout') {
        db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(cookieValue(req, 'pride_admin')));
        res.setHeader('Set-Cookie', cookie('pride_admin', '', 0));
        return json(200, { ok: true });
      }
      if (path === '/api/invitations') {
        if (!admin(req)) return json(401, { error: 'Silakan masuk dashboard.' });
        const name = cleanName(input.name);
        if (!validName(name) || !Object.hasOwn(categories, input.category)) return json(400, { error: 'Isi nama dan pilih kategori tamu.' });
        const id = randomBytes(24).toString('hex');
        const rootSlug = nameSlug(name); let slug = rootSlug; let suffix = 2;
        while (db.prepare('SELECT 1 FROM invitations WHERE slug=?').get(slug)) slug = `${rootSlug}-${suffix++}`;
        db.prepare('INSERT INTO invitations (id,name,category,slug) VALUES (?,?,?,?)').run(id, name, input.category, slug);
        return json(201, { name, ...categories[input.category], url: `${origin}${base}/?kepada=${slug}&kategori=${categories[input.category].label}&jam=${categories[input.category].arrival}` });
      }
      const invite = input.invitationId ? db.prepare('SELECT id, name, category FROM invitations WHERE id=?').get(String(input.invitationId)) : null;
      if (input.invitationId && !invite) return json(404, { error: 'Undangan tidak ditemukan. Silakan periksa tautan dari panitia.' });
      const name = invite ? invite.name : cleanName(input.name);
      if (!validName(name) || !['hadir', 'berhalangan'].includes(input.attendance)) return json(400, { error: 'Isi nama dan pilih konfirmasi kehadiran.' });
      let guestToken = cookieValue(req, 'pride_guest');
      if (!/^[a-f0-9]{64}$/.test(guestToken)) guestToken = token();
      const id = invite ? hash(`invitation:${invite.id}`) : hash(guestToken);
      const nameKey = invite ? `invitation:${invite.id}` : name.toLocaleLowerCase('id-ID');
      const existing = db.prepare('SELECT id FROM responses WHERE name_key=?').get(nameKey);
      if (existing && existing.id !== id) return json(409, { error: 'Nama ini sudah dikonfirmasi. Untuk mengubahnya, gunakan perangkat dan browser yang sama atau hubungi panitia.' });
      db.prepare(`INSERT INTO responses (id,name,name_key,attendance) VALUES (?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_key=excluded.name_key,attendance=excluded.attendance,updated_at=CURRENT_TIMESTAMP`).run(id, name, nameKey, input.attendance);
      res.setHeader('Set-Cookie', cookie('pride_guest', guestToken, 86400 * 90));
      return json(200, { ok: true, name, attendance: input.attendance });
    } catch (error) {
      console.error('Invitation request failed:', error.code || error.name, error.message);
      if (!res.headersSent) json(500, { error: 'Data belum berhasil disimpan. Silakan coba kembali.' });
      else res.end();
    }
  });
  server.on('close', () => db.close());
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = invitationServer({
    database: process.env.PRIDE_DATABASE || resolve(root, 'data', 'rsvp.sqlite'),
    password: process.env.ADMIN_PASSWORD,
    origin: process.env.PUBLIC_ORIGIN,
    secure: process.env.COOKIE_SECURE !== 'false',
  });
  server.listen(Number(process.env.PORT || 3002), '127.0.0.1', () => console.log('Angklung Pride invitation listening on loopback.'));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
}
