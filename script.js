const WEDDING_TARGET = new Date('2026-11-01T13:00:00+09:00').getTime();

document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('dragstart', function (e) {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

function openEnvelope() {
  document.getElementById('envelope').classList.add('opened');
  document.getElementById('envelope-flap').classList.add('open');
  const audio = document.getElementById('bgm');
  const label = document.getElementById('music-label');
  audio.play().then(() => {
    label.textContent = 'On';
  }).catch(() => {
    label.textContent = 'Off';
  });
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
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.tab) === i);
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
  'images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg',
  'images/image4.jpg', 'images/image5.jpg', 'images/image6.jpg',
  'images/image7.jpg', 'images/image8.jpg', 'images/image9.jpg',
  'images/image10.jpg', 'images/image11.jpg', 'images/image12.jpg',
  'images/image13.jpg', 'images/image14.jpg', 'images/image15.jpg',
  'images/image16.jpg', 'images/image17.jpg', 'images/image18.jpg',
  'images/image19.jpg', 'images/image20.jpg', 'images/image21.jpg',
  'images/image22.jpg', 'images/image23.jpg', 'images/image24.jpg',
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

// Swipe navigation for the image modal on touch devices
(function initModalSwipe() {
  const modal = document.getElementById('image-modal');
  const SWIPE_THRESHOLD = 40;
  let startX = 0;
  let startY = 0;
  let swiped = false;

  modal.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    swiped = false;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swiped = true;
      e.preventDefault();
      modalNav(dx < 0 ? 1 : -1, e);
    }
  });

  // Prevent the swipe's trailing click from closing the modal
  modal.addEventListener('click', (e) => {
    if (swiped) {
      e.stopPropagation();
      swiped = false;
    }
  }, true);
})();

function highlightOnes(text) {
  return text.replace(/1/g, '<span class="lucky-one">1</span>');
}

function openRsvpModal(html) {
  document.getElementById('rsvp-result-message').innerHTML = html;
  document.getElementById('rsvp-result-modal').style.display = 'flex';
}

function closeRsvpModal() {
  document.getElementById('rsvp-result-modal').style.display = 'none';
}

// Replace with your deployed Google Apps Script Web App URL (see apps-script.gs).
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqwK0QAO29amne5IoSha782AHCmh4edg8oxTiS8HWyrwQODFsJuExWXsOwugyj5Okj-w/exec';

let selectedSide = '신랑측';
let selectedAttendance = null;

function selectSide(btn) {
  document.querySelectorAll('.rsvp-side-btn').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSide = btn.dataset.value;
}

function selectAttendance(btn) {
  document.querySelectorAll('.rsvp-attend-btn').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAttendance = btn.dataset.value;
}

function submitRsvp(event) {
  event.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const status = document.getElementById('rsvp-status');
  const submitBtn = event.target.querySelector('.rsvp-submit-btn');

  if (!selectedSide) {
    status.textContent = '신랑측 / 신부측을 선택해주세요.';
    return;
  }
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
    type: selectedSide,      // 신랑/신부
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
      status.textContent = '';
      if (selectedAttendance === '참석') {
        openRsvpModal(
          `감사합니다.<br>${highlightOnes('11월 1일 1요일 오후 1시')}에 만나요~` +
          `<br><span class="rsvp-result-sub">1이 다섯 개! 기억하기 쉽죠? 🎉</span>`
        );
      } else {
        openRsvpModal('소중한 마음 감사합니다.<br>함께하지 못해 아쉽지만<br>축하하는 마음 잘 전해받았습니다 :)');
      }
      event.target.reset();
      document.querySelectorAll('.rsvp-attend-btn').forEach((b) => b.classList.remove('selected'));
      document.querySelectorAll('.rsvp-side-btn').forEach((b) => b.classList.remove('selected'));
      document.querySelector('.rsvp-side-btn[data-value="신랑측"]').classList.add('selected');
      selectedAttendance = null;
      selectedSide = '신랑측';
    })
    .catch(() => {
      status.textContent = '제출에 실패했습니다. 잠시 후 다시 시도해주세요.';
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
}
