const WEDDING_TARGET = new Date('2026-11-01T13:00:00+09:00').getTime();

function openEnvelope() {
  document.getElementById('envelope').classList.add('opened');
  document.getElementById('envelope-flap').classList.add('open');
}

function toggleMusic() {
  const audio = document.getElementById('bgm');
  const label = document.getElementById('music-label');
  if (audio.paused) {
    audio.play().catch(() => {});
    label.textContent = 'On';
  } else {
    audio.pause();
    label.textContent = 'Off';
  }
}

function tick() {
  const diff = Math.max(0, WEDDING_TARGET - Date.now());
  const pad = (n) => String(n).padStart(2, '0');
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  document.getElementById('dday-badge').textContent = diff <= 0 ? 'D-DAY ♡ 축하해주셔서 감사합니다' : `D-${d}`;
  document.getElementById('timer-d').textContent = pad(d);
  document.getElementById('timer-h').textContent = pad(h);
  document.getElementById('timer-m').textContent = pad(m);
  document.getElementById('timer-s').textContent = pad(s);
}
tick();
setInterval(tick, 1000);

function setTab(i) {
  document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === i);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.style.display = Number(panel.dataset.tabPanel) === i ? '' : 'none';
  });
}

function toggleAccordion(which) {
  const content = document.getElementById(which + '-content');
  const arrow = document.getElementById(which + '-arrow');
  const collapsed = content.classList.toggle('collapsed');
  arrow.textContent = collapsed ? '▼' : '▲';
}

function copyAccount(btn) {
  const text = btn.dataset.copy;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const original = btn.textContent;
  btn.textContent = '복사됨';
  setTimeout(() => { btn.textContent = original; }, 1500);
}

const GALLERY_PHOTOS = [
  'images/photo1.jpg', 'images/photo2.jpg', 'images/photo3.jpg',
  'images/photo4.jpg', 'images/photo5.jpg', 'images/photo6.jpg',
  'images/photo7.jpg', 'images/photo8.jpg', 'images/photo9.jpg',
];
let modalIndex = 0;

function openModal(index) {
  modalIndex = index;
  document.getElementById('image-modal').style.display = 'flex';
  document.getElementById('modal-img').src = GALLERY_PHOTOS[modalIndex];
}

function modalNav(dir, event) {
  event.stopPropagation();
  modalIndex = (modalIndex + dir + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  document.getElementById('modal-img').src = GALLERY_PHOTOS[modalIndex];
}

function closeModal() {
  document.getElementById('image-modal').style.display = 'none';
}

// Replace with your deployed Google Apps Script Web App URL (see apps-script.gs).
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqwK0QAO29amne5IoSha782AHCmh4edg8oxTiS8HWyrwQODFsJuExWXsOwugyj5Okj-w/exec';

let selectedAttendance = null;

function selectAttendance(btn) {
  document.querySelectorAll('.rsvp-attend-btn').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAttendance = btn.dataset.value;
}

function submitRsvp(event) {
  event.preventDefault();
  const side = document.getElementById('rsvp-side').value;
  const name = document.getElementById('rsvp-name').value.trim();
  const status = document.getElementById('rsvp-status');
  const submitBtn = event.target.querySelector('.rsvp-submit-btn');

  if (!name) {
    status.textContent = '성함을 입력해주세요.';
    return;
  }
  if (!selectedAttendance) {
    status.textContent = '참석 여부를 선택해주세요.';
    return;
  }
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
    status.textContent = '구글 시트 연동 URL이 아직 설정되지 않았습니다.';
    return;
  }

  submitBtn.disabled = true;
  status.textContent = '제출 중...';

  const data = {
    type: side,      // 신랑/신부
    name: name,      // 이름
    attendance: selectedAttendance // 참석/불참
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  })
    .then(() => {
      status.textContent = '제출이 완료되었습니다. 감사합니다 :)';
      event.target.reset();
      document.querySelectorAll('.rsvp-attend-btn').forEach((b) => b.classList.remove('selected'));
      selectedAttendance = null;
    })
    .catch(() => {
      status.textContent = '제출에 실패했습니다. 잠시 후 다시 시도해주세요.';
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
}
