import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { invitationServer, base } from './server.mjs';

test('RSVP persistence, update, duplicate protection, admin access and logout', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'pride-test-'));
  const database = join(folder, 'responses.sqlite');
  const password = 'local-test-password-1234';
  const origin = 'http://localhost';
  let server;
  const start = async () => {
    server = invitationServer({ database, password, origin, secure: false });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return `http://127.0.0.1:${server.address().port}${base}`;
  };
  const stop = () => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  try {
    let url = await start();
    const post = (path, data, cookie = '', requestOrigin = origin) => fetch(url + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: requestOrigin, Cookie: cookie }, body: JSON.stringify(data) });
    assert.equal((await fetch(url + '/')).status, 200);
    assert.equal((await fetch(url + '/api/responses')).status, 401);
    assert.equal((await post('/api/rsvp', { name: 'Tamu Tes', attendance: 'hadir' }, '', 'https://attacker.invalid')).status, 403);
    assert.equal((await post('/api/rsvp', { name: '', attendance: 'invalid' })).status, 400);
    const saved = await post('/api/rsvp', { name: 'Tamu Tes', attendance: 'hadir' });
    assert.equal(saved.status, 200);
    const guestCookie = saved.headers.get('set-cookie').split(';')[0];
    assert.equal((await post('/api/rsvp', { name: 'Tamu Tes', attendance: 'berhalangan' })).status, 409);
    assert.equal((await post('/api/rsvp', { name: 'Tamu Tes', attendance: 'berhalangan' }, guestCookie)).status, 200);
    assert.equal((await post('/api/login', { password: 'wrong' })).status, 401);
    const login = await post('/api/login', { password });
    assert.equal(login.status, 200);
    const adminCookie = login.headers.get('set-cookie').split(';')[0];
    let list = await fetch(url + '/api/responses', { headers: { Cookie: adminCookie } });
    assert.deepEqual((await list.json()).responses, [{ name: 'Tamu Tes', attendance: 'berhalangan' }]);
    assert.equal((await post('/api/invitations', { name: 'Tamu Tanpa Akses', category: 'vip' })).status, 401);
    assert.equal((await post('/api/invitations', { name: 'Tamu Tes', category: 'invalid' }, adminCookie)).status, 400);
    const invitationIds = [];
    for (const [category, arrival] of [['vvip', '17.30'], ['vip', '18.00'], ['vip-biasa', '18.00'], ['reguler', '18.00']]) {
      const created = await post('/api/invitations', { name: `Tamu ${category}`, category }, adminCookie);
      assert.equal(created.status, 201);
      const invitation = await created.json();
      assert.equal(invitation.arrival, arrival);
      const slug = new URL(invitation.url).searchParams.get('kepada');
      assert.equal(slug, `tamu-${category}`);
      const guestData = await (await fetch(url + `/api/invitation?kepada=${slug}`)).json();
      const invitationId = guestData.invitation.id;
      assert.match(invitationId, /^[a-f0-9]{48}$/);
      invitationIds.push(invitationId);
      const legacyData = await (await fetch(url + `/api/invitation?id=${invitationId}`)).json();
      assert.equal(legacyData.invitation.slug, slug);
      assert.equal(guestData.invitation.name, `Tamu ${category}`);
      assert.equal(guestData.response, null);
      const confirm = await post('/api/rsvp', { invitationId, name: 'Nama tidak boleh menimpa penerima', attendance: 'hadir' }, guestCookie);
      assert.equal((await confirm.json()).name, `Tamu ${category}`);
    }
    assert.equal((await post('/api/rsvp', { invitationId: invitationIds[0], attendance: 'berhalangan' })).status, 200);
    const issued = (await (await fetch(url + '/api/responses', { headers: { Cookie: adminCookie } })).json()).responses;
    assert.equal(issued.length, 4);
    assert.equal(issued.find(r => r.name === 'Tamu vip').attendance, 'berhalangan');
    assert.equal(issued.find(r => r.name === 'Tamu reguler').attendance, 'hadir');
    const duplicate = await (await post('/api/invitations', { name: 'Tamu vip', category: 'vip' }, adminCookie)).json();
    assert.ok(duplicate.url.endsWith('?kepada=tamu-vip-2'));
    assert.equal((await fetch(url + '/api/invitation?id=invalid')).status, 404);
    await stop(); url = await start();
    assert.equal((await (await fetch(url + `/api/invitation?id=${invitationIds[0]}`)).json()).response.attendance, 'berhalangan');
    list = await fetch(url + '/api/responses', { headers: { Cookie: adminCookie } });
    assert.deepEqual((await list.json()).responses.slice(1), issued);
    assert.equal((await post('/api/logout', {}, adminCookie)).status, 200);
    assert.equal((await fetch(url + '/api/responses', { headers: { Cookie: adminCookie } })).status, 401);
    assert.equal((await fetch(url + '/../server.mjs')).status, 404);
  } finally { if (server?.listening) await stop(); rmSync(folder, { recursive: true, force: true }); }
});

test('existing invitations receive stable name aliases without changing RSVP data', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'pride-alias-'));
  const database = join(folder, 'old.sqlite');
  const db = new DatabaseSync(database);
  db.exec("CREATE TABLE invitations(id TEXT PRIMARY KEY,name TEXT NOT NULL,category TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP); INSERT INTO invitations(id,name,category) VALUES ('old-a','Prof. Jaka Sembiring','vip'),('old-b','Prof. Jaka Sembiring','reguler')");
  db.close();
  const server = invitationServer({ database, password: 'local-test-password-1234', origin: 'http://localhost', secure: false });
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}${base}`;
    const old = await (await fetch(url + '/api/invitation?id=old-a')).json();
    const named = await (await fetch(url + '/api/invitation?kepada=prof-jaka-sembiring')).json();
    assert.equal(old.invitation.id, named.invitation.id);
    assert.equal(old.invitation.slug, 'prof-jaka-sembiring');
    const second = await (await fetch(url + '/api/invitation?id=old-b')).json();
    assert.equal(second.invitation.slug, 'prof-jaka-sembiring-2');
  } finally { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); rmSync(folder, { recursive: true, force: true }); }
});
