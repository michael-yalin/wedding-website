/* ==========================================================
   Michael & Yalin Wedding — Front-end Logic
   Structured after https://littleroomweb.com/template/Flowers/
   ========================================================== */

// 請將下方網址換成你部署 Google Apps Script 後取得的 Web App URL
// 詳細部署步驟請見 google-apps-script.md
const GOOGLE_SHEET_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

const WEDDING_DATE = new Date('Oct 11, 2026 11:00:00');

/* ---------------- Gallery photos ---------------- */
const GALLERY_PHOTOS = [
  'IMG_0279.JPG', 'IMG_0280.JPG', 'IMG_0295.JPG', 'IMG_0296.JPG',
  'IMG_0297.JPG', 'IMG_0298.JPG', 'IMG_0299.JPG', 'IMG_0300.JPG',
  'IMG_0301.JPG', 'IMG_0302.JPG', 'IMG_0303.JPG', 'IMG_0304.JPG',
  'IMG_0305.JPG', 'IMG_0343.JPG', 'IMG_0344.JPG', 'IMG_0345.JPG',
  'IMG_0347.JPG', 'IMG_0348.JPG', 'IMG_0366.JPG', 'IMG_0367.JPG',
  'IMG_0368.JPG', 'IMG_0369.JPG'
].map(name => `reference/gallery/${name}`);

function buildGalleryGrid() {
  const grid = document.getElementById('photo-gallery-grid');
  GALLERY_PHOTOS.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '婚禮相簿照片 ' + (index + 1);
    img.loading = 'lazy';
    img.addEventListener('click', () => openViewer(index));
    grid.appendChild(img);
  });
}

/* ---------------- Album overlay + full-image viewer ---------------- */
function showgallery() {
  document.getElementById('photo-gallery').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('closebutton').style.display = 'block';
}

function closegallery() {
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('closebutton').style.display = 'none';
  document.getElementById('photo-gallery').style.display = 'none';
  closeViewer();
}

let currentViewerIndex = 0;
function openViewer(index) {
  currentViewerIndex = index;
  document.getElementById('viewerImg').src = GALLERY_PHOTOS[index];
  document.getElementById('photo-viewer').style.display = 'flex';
}
function closeViewer() {
  document.getElementById('photo-viewer').style.display = 'none';
}
function showNextViewerPhoto() {
  currentViewerIndex = (currentViewerIndex + 1) % GALLERY_PHOTOS.length;
  document.getElementById('viewerImg').src = GALLERY_PHOTOS[currentViewerIndex];
}
function showPrevViewerPhoto() {
  currentViewerIndex = (currentViewerIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  document.getElementById('viewerImg').src = GALLERY_PHOTOS[currentViewerIndex];
}
document.addEventListener('click', (e) => {
  if (e.target.id === 'photo-viewer') closeViewer();
});

function JumpTo(id) {
  document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/* ---------------- Scroll reveal (mirrors reference site) ---------------- */
function reveal() {
  const reveals = document.querySelectorAll(
    '.countdown-area-box>div,.photo,.dresscode-box,.theplace,.guide,.map a,.intro-box,.intro-content,.time,.invite h2,.invite p'
  );
  const windowHeight = window.innerHeight;
  reveals.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', reveal);

function revealbg2() {
  const target = document.querySelector('.invite');
  if (!target) return;
  const windowHeight = window.innerHeight;
  const elementTop = target.getBoundingClientRect().top;
  document.getElementById('secondbg').style.display = elementTop < windowHeight ? 'block' : 'none';
}
window.addEventListener('scroll', revealbg2);

function revealbg3() {
  const target = document.querySelector('.RSVP');
  if (!target) return;
  const windowHeight = window.innerHeight;
  const elementTop = target.getBoundingClientRect().top;
  document.getElementById('thirdbg').style.display = elementTop < windowHeight ? 'block' : 'none';
}
window.addEventListener('scroll', revealbg3);

/* ---------------- RSVP form ---------------- */
function ToggleFunction(formId, groupName) {
  // radio-pill flower highlight handled purely by :checked CSS selector; nothing else needed
}

function AttendFunction(id) {
  const form = document.getElementById(id);
  const notAttend = form.querySelectorAll('.not-attend');
  const ATTEND = form['ATTEND'];

  if (ATTEND.value === '出席') {
    notAttend.forEach((el) => { el.style.display = ''; });
  } else {
    notAttend.forEach((el) => { el.style.display = 'none'; });
    form['ATTENDCOUNT'].value = '0';
    document.getElementById('childchair-no').checked = true;
    form['VEGCOUNT'].value = '0';
    document.getElementById('driving-no').checked = true;
    clearFieldError('AttendCount');
  }
}

function InvitationFunction() {
  const form = document.forms['form1'];
  const invitation = form['INVITATION'].value;
  const addressRow = document.getElementById('addressRow');
  const addressLabel = document.getElementById('addressLabel');
  const address = form['ADDRESS'];

  if (invitation === '需要') {
    addressRow.classList.remove('is-hidden');
    addressLabel.style.display = '';
  } else {
    addressRow.classList.add('is-hidden');
    addressLabel.style.display = 'none';
    address.value = '';
    clearFieldError('Address');
  }
}

function setFieldError(fieldId, message) {
  const errEl = document.getElementById('err-' + fieldId);
  if (errEl) errEl.textContent = message;
}
function clearFieldError(fieldId) {
  setFieldError(fieldId, '');
}

function submitform1() {
  const form = document.getElementById('form1');
  const NAME = form['NAME'].value.trim();
  const EMAIL = form['EMAIL'].value.trim();
  const PHONE = form['PHONE'].value.trim();
  const ATTEND = form['ATTEND'].value;
  const ATTENDCOUNT = form['ATTENDCOUNT'].value;
  const CHILDCHAIR = form['CHILDCHAIR'].value;
  const VEGCOUNT = form['VEGCOUNT'].value;
  const INVITATION = form['INVITATION'].value;
  const ADDRESS = form['ADDRESS'].value.trim();
  const DRIVING = form['DRIVING'].value;
  const MESSAGE = form['MESSAGE'].value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\-\s]{8,}$/;

  ['Name', 'Email', 'Phone', 'AttendCount', 'Invitation', 'Address'].forEach(clearFieldError);

  if (NAME === '') {
    document.getElementById('Name').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('Name', '請填寫姓名');
    return;
  }
  if (EMAIL === '' || !emailPattern.test(EMAIL)) {
    document.getElementById('Email').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('Email', '請輸入有效的 Email');
    return;
  }
  if (PHONE === '' || !phonePattern.test(PHONE)) {
    document.getElementById('Phone').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('Phone', '請輸入有效的手機號碼');
    return;
  }
  if (ATTEND === '出席' && ATTENDCOUNT === '') {
    document.getElementById('AttendCount').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('AttendCount', '請選擇參加人數');
    return;
  }
  if (INVITATION === '') {
    document.getElementById('Invitation').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('Invitation', '請問是否需要紙本喜帖');
    return;
  }
  if (INVITATION === '需要' && ADDRESS === '') {
    document.getElementById('Address').scrollIntoView({ block: 'center', behavior: 'smooth' });
    setFieldError('Address', '請留下喜帖收件地址');
    return;
  }

  function addZero(i) { return i < 10 ? '0' + i : i; }
  const today = new Date();
  const SUBMITTIME = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() +
    ' ' + addZero(today.getHours()) + ':' + addZero(today.getMinutes()) + ':' + addZero(today.getSeconds());

  document.getElementById('loading').style.display = 'block';

  $.ajax({
    type: 'get',
    url: GOOGLE_SHEET_WEB_APP_URL,
    data: {
      SUBMITTIME: SUBMITTIME,
      NAME: NAME,
      EMAIL: EMAIL,
      PHONE: PHONE,
      ATTEND: ATTEND,
      ATTENDCOUNT: ATTENDCOUNT,
      CHILDCHAIR: CHILDCHAIR,
      VEGCOUNT: VEGCOUNT,
      INVITATION: INVITATION,
      ADDRESS: ADDRESS,
      DRIVING: DRIVING,
      MESSAGE: MESSAGE
    },
    dataType: 'JSON',
    success: function (response) {
      if (response && response.result === 'success') {
        document.getElementById('submit-success').style.display = 'flex';
      } else {
        alert('傳送異常，請再試一次');
      }
    },
    error: function (xhr) {
      if (xhr.status === 0) {
        alert('異常！請再試一次');
      } else {
        alert(xhr.status + ':' + xhr.statusText);
      }
    },
    complete: function () {
      document.getElementById('loading').style.display = 'none';
    }
  });
}

function submitok() {
  window.location.reload();
}

/* ---------------- Countdown ---------------- */
const countdownTimer = setInterval(function () {
  const now = new Date().getTime();
  const distance = WEDDING_DATE.getTime() - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').innerHTML = days;
  document.getElementById('hours').innerHTML = hours;
  document.getElementById('mins').innerHTML = minutes;
  document.getElementById('secs').innerHTML = seconds;

  if (distance < 0) {
    clearInterval(countdownTimer);
    document.getElementById('countdown-area').innerHTML = "<h2>Wedding Countdown</h2><br>IT'S TIME TO CELEBRATE !";
  }
}, 1000);

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  buildGalleryGrid();
  reveal();
  revealbg2();
  revealbg3();
});
