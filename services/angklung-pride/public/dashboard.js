const base = '/undangan/angklung-pride';
let responses = [];
let loading = false;
let latestInvitation = null;
const login = document.querySelector('#login-form');
const content = document.querySelector('#dashboard-content');
const logout = document.querySelector('#logout');
const message = document.querySelector('#dashboard-message');
function render() {
  document.querySelector('#total').textContent = responses.length;
  document.querySelector('#present').textContent = responses.filter(r => r.attendance === 'hadir').length;
  document.querySelector('#absent').textContent = responses.filter(r => r.attendance === 'berhalangan').length;
  document.querySelector('#pending').textContent = responses.filter(r => !r.attendance).length;
  const query = document.querySelector('#search').value.trim().toLocaleLowerCase('id');
  const list = document.querySelector('#responses');
  list.replaceChildren();
  const visible = responses.filter(r => r.name.toLocaleLowerCase('id').includes(query));
  if (!visible.length) {
    const empty = document.createElement('li'); empty.className = 'empty'; empty.textContent = query ? 'Nama tamu tidak ditemukan.' : 'Belum ada tamu. Buat undangan pertama di atas.'; list.append(empty);
  }
  for (const response of visible) {
    const row = document.createElement('li'); row.className = 'response-row';
    const info = document.createElement('div'); info.className = 'response-info';
    const name = document.createElement('span'); name.className = 'response-name'; name.textContent = response.name; info.append(name);
    if (response.category) { const category = document.createElement('span'); category.className = 'response-category'; category.textContent = `${response.category} · ${response.arrival} WIB`; info.append(category); }
    const actions = document.createElement('div'); actions.className = 'response-actions';
    const badge = document.createElement('span'); badge.className = response.attendance === 'hadir' ? 'badge' : response.attendance ? 'badge absent' : 'badge pending'; badge.textContent = response.attendance === 'hadir' ? 'Hadir' : response.attendance ? 'Berhalangan hadir' : 'Belum konfirmasi'; actions.append(badge);
    if (response.url) { const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'small-button row-copy'; copy.textContent = 'Salin tautan'; copy.setAttribute('aria-label', `Salin tautan undangan ${response.name}`); copy.addEventListener('click', async () => { try { await copyText(response.url); copy.textContent = 'Tersalin ✓'; } catch { message.textContent = 'Belum berhasil menyalin. Silakan coba lagi.'; } }); actions.append(copy); }
    row.append(info, actions); list.append(row);
  }
}
async function load() {
  if (loading) return;
  loading = true;
  try {
    const response = await fetch(`${base}/api/responses`, { cache: 'no-store' });
    if (response.status === 401) { login.hidden = false; content.hidden = true; logout.hidden = true; responses = []; latestInvitation = null; document.querySelector('#invitation-result').hidden = true; document.querySelector('#invite-text').value = ''; return; }
    if (!response.ok) throw new Error();
    responses = (await response.json()).responses;
    login.hidden = true; content.hidden = false; logout.hidden = false;
    document.querySelector('#password').value = '';
    render(); message.textContent = 'Diperbarui pukul ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch { message.textContent = 'Data belum berhasil dimuat. Silakan tekan Perbarui.'; }
  finally { loading = false; }
}
login.addEventListener('submit', async event => {
  event.preventDefault();
  const button = login.querySelector('button'); const error = document.querySelector('#login-message');
  button.disabled = true; error.textContent = '';
  try {
    const response = await fetch(`${base}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: document.querySelector('#password').value }) });
    if (!response.ok) { const data = await response.json(); throw new Error(data.error); }
    await load();
  } catch (e) { error.textContent = e.message === 'Failed to fetch' ? 'Periksa koneksi Anda dan coba lagi.' : e.message; }
  finally { button.disabled = false; }
});
logout.addEventListener('click', async () => {
  try { const response = await fetch(`${base}/api/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); if (!response.ok) throw new Error(); responses = []; render(); await load(); }
  catch { message.textContent = 'Belum berhasil keluar. Silakan coba lagi.'; }
});
document.querySelector('#search').addEventListener('input', render);
document.querySelector('#refresh').addEventListener('click', load);
function invitationMessage(invite) {
  return `Kepada Yth:\n${invite.name}\n\nDengan hormat, kami mengundang Bapak/Ibu untuk menghadiri Angklung Pride 2026 — One Sound, a Symphony for the World.\n\nJumat, 27 November 2026\nKategori: ${invite.label}\nKedatangan: pukul ${invite.arrival} WIB\nPertunjukan: pukul 19.00 WIB\nSaung Angklung Udjo, Jl. Padasuka No. 118, Bandung\n\nSilakan buka undangan dan konfirmasikan kehadiran melalui tautan berikut:\n${invite.url}\n\nTerima kasih. Kami menantikan kehadiran Bapak/Ibu.`;
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const area = document.createElement('textarea'); area.value = text; area.className = 'clipboard-fallback'; area.setAttribute('readonly', ''); document.body.append(area); area.select();
    const copied = document.execCommand('copy'); area.remove();
    if (!copied) throw new Error('COPY_FAILED');
  }
}
document.querySelector('#invitation-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.querySelector('#create-invitation'); const status = document.querySelector('#maker-message');
  button.disabled = true; status.textContent = '';
  try {
    const response = await fetch(`${base}/api/invitations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: document.querySelector('#invite-name').value.trim(), category: document.querySelector('#invite-category').value }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Undangan belum berhasil dibuat.');
    latestInvitation = data;
    document.querySelector('#invite-text').value = invitationMessage(data);
    document.querySelector('#preview-link').href = data.url;
    document.querySelector('#invitation-result').hidden = false;
    document.querySelector('#copy-message-status').textContent = '';
    status.textContent = 'Undangan berhasil dibuat. Silakan salin pesan atau tautannya.';
    await load();
  } catch (error) { status.textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Silakan coba lagi.' : error.message; }
  finally { button.disabled = false; }
});
for (const [id, text] of [['copy-message', () => invitationMessage(latestInvitation)], ['copy-link', () => latestInvitation.url]]) {
  document.querySelector(`#${id}`).addEventListener('click', async () => {
    if (!latestInvitation) return;
    const status = document.querySelector('#copy-message-status');
    try { await copyText(text()); status.textContent = id === 'copy-message' ? 'Pesan undangan tersalin. Siap ditempel ke WhatsApp.' : 'Tautan undangan tersalin.'; }
    catch { status.textContent = 'Silakan tekan lama teks undangan di atas untuk menyalin secara manual.'; document.querySelector('#invite-text').focus(); document.querySelector('#invite-text').select(); }
  });
}
setInterval(() => { if (!document.hidden && !content.hidden) load(); }, 15000);
load();
