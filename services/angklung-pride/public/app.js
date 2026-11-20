const base = '/undangan/angklung-pride';
const form = document.querySelector('#rsvp-form');
const nameInput = document.querySelector('#name');
const params = new URLSearchParams(location.search);
let invitationId = params.get('id');
const guest = params.get('kepada')?.trim().slice(0, 160);
const invitationSlug = guest && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guest) ? guest : null;
let invitationReady = !invitationId && !invitationSlug;
if (guest && !invitationSlug) {
  document.querySelector('#guest-name').textContent = guest;
  nameInput.value = guest;
}
if (!invitationReady) { document.querySelector('#submit-button').disabled = true; document.querySelector('#guest-name').textContent = 'Memuat undangan…'; }
const lookup = invitationId ? `id=${encodeURIComponent(invitationId)}` : invitationSlug ? `kepada=${encodeURIComponent(invitationSlug)}` : null;
fetch(lookup ? `${base}/api/invitation?${lookup}` : `${base}/api/me`, { cache: 'no-store' }).then(async r => {
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Undangan belum berhasil dimuat. Silakan muat ulang halaman.');
  return data;
}).then(data => {
  if (data.invitation) {
    const invite = data.invitation;
    invitationId = invite.id;
    if (invite.slug) history.replaceState(null, '', `${base}/?kepada=${invite.slug}`);
    document.querySelector('#guest-name').textContent = invite.name;
    nameInput.value = invite.name;
    nameInput.readOnly = true;
    document.querySelector('#guest-category').textContent = `Tamu ${invite.label}`;
    document.querySelector('#guest-category').hidden = false;
    document.querySelector('#arrival-time').textContent = `Kedatangan pukul ${invite.arrival} WIB`;
    document.querySelector('#arrival-caption').textContent = 'Pertunjukan mulai 19.00 WIB';
    invitationReady = true;
    document.querySelector('#submit-button').disabled = false;
  }
  if (!data?.response) return;
  nameInput.value = data.response.name;
  document.querySelector('#guest-name').textContent = data.response.name;
  form.elements.attendance.value = data.response.attendance;
  document.querySelector('#submit-button').firstChild.textContent = 'Perbarui konfirmasi ';
}).catch(error => {
  const message = document.querySelector('#form-message');
  message.className = 'error';
  message.textContent = error.message;
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!invitationReady) return;
  const button = document.querySelector('#submit-button');
  const message = document.querySelector('#form-message');
  button.disabled = true;
  button.firstChild.textContent = 'Menyimpan… ';
  message.textContent = '';
  try {
    const response = await fetch(`${base}/api/rsvp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value.trim(), attendance: form.elements.attendance.value, ...(invitationId ? { invitationId } : {}) }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Konfirmasi belum tersimpan. Silakan coba lagi.');
    message.className = 'success';
    message.textContent = data.attendance === 'hadir'
      ? 'Terima kasih. Konfirmasi hadir Anda sudah tersimpan. Sampai bertemu di Angklung Pride 2026!'
      : 'Terima kasih. Konfirmasi berhalangan hadir Anda sudah tersimpan.';
    document.querySelector('#guest-name').textContent = data.name;
    message.focus();
  } catch (error) {
    message.className = 'error';
    message.textContent = error.message === 'Failed to fetch' ? 'Koneksi terputus. Silakan coba kirim kembali.' : error.message;
    message.focus();
  } finally {
    button.disabled = false;
    button.firstChild.textContent = 'Perbarui konfirmasi ';
  }
});
