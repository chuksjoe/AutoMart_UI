let currentWidth = window.innerWidth;

// Helper functions
const toggleScroll = () => {
  const overlays = document.querySelectorAll('.overlay');
  let hasOverlay = false;
  overlays.forEach((overlay) => {
    if (overlay.style.display === 'block') hasOverlay = true;
  });
  if (hasOverlay) document.body.classList.add('no-scroll');
  else document.body.classList.remove('no-scroll');
};

const toggleClass = (node, classN) => {
  if (node.classList.contains(classN)) node.classList.remove(classN);
  else node.classList.add(classN);
};

const formatCurrency = (value) => {
  let val = value;
  val = val.replace(/\D/g, '');
  val = val ? parseInt(val, 10) : 0;
  return val === 0 ? '' : `N ${val.toLocaleString('en-US')}`;
};

const formatKilometer = (value) => {
  let val = value;
  val = val.replace(/\D/g, '');
  val = val ? parseInt(val, 10) : 0;
  return val === 0 ? '' : `(mpg) ${val.toLocaleString('en-US')}`;
};

const appendLeadZero = val => (Number(val) > 10 ? val : `0${val}`);

const isToday = (date) => {
  const today = new Date();
  return today.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
};

const configDate = (dateStr) => {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'April', 'May',
  'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const time = date.toLocaleString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const day = `${days[date.getDay()]},
   ${appendLeadZero(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
  return `${isToday(date) ? 'Today' : day}, ${time.replace(' ', '')}`;
};

const autoRefresh = (time) => {
  setTimeout(() => {
    document.location.reload();
  }, time);
};

const errorMessage = (err) => {
  let msg = '';
  if (err.message.includes('NetworkError')) {
    msg = `Network Error!<br/>Ensure you are connected to the Internet.<br/>
      Then refresh page.`;
  } else if (err.message.includes('length')) {
    msg = `Your session has expired!<br/>Please, re-login to continue.<br/>
      click <a href='./signin.html'>here to re-login.</a>`;
  } else {
    msg = err.message;
  }
  return msg;
};

const createCaptcha = () => {
  let code = '';
  const charSet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()';
  const captchaLen = 8;
  const captcha = [];
  for (let i = 0; i < captchaLen; i += 1) {
    const index = Math.floor(Math.random() * charSet.length + 1);
    if (captcha.indexOf(charSet[index]) === -1) {
      captcha.push(charSet[index]);
    } else {
      i -= 1;
    }
  }
  code = captcha.join('');
  const canvas = document.createElement('canvas');
  canvas.id = 'captcha';
  canvas.width = 150;
  canvas.height = 50;
  const ctx = canvas.getContext('2d');
  ctx.font = '28px Georgia';
  ctx.strokeText(code, 0, 30);

  return { canvas, code };
};

const enablePriceSummitBtn = (price, btn) => {
  if (price.length < 7) {
    btn.setAttribute('disabled', 'disabled');
  } else {
    btn.removeAttribute('disabled');
  }
};

/* ============ MAIN LOGICS ========================= */
// Toggle Menubar filter bar when the screen is below 800px
const menuList = document.querySelector('.menu-list');
const menuBtn = document.querySelector('.menu-btn');

const adjustMenubar = () => {
  if (window.innerWidth > 750) {
    menuList.style.display = 'flex';
  } else {
    menuList.style.display = 'none';
    menuBtn.firstChild.classList.remove('hide');
    menuBtn.lastChild.classList.add('hide');
  }
};

menuBtn.onclick = () => {
  const icons = document.querySelectorAll('.menu-btn i');
  icons.forEach((icon) => {
    toggleClass(icon, 'hide');
  });
  menuList.style.display = menuList.style.display === 'block' ? ('none') : ('block');
};

window.addEventListener('resize', () => {
  if (currentWidth !== window.innerWidth) {
    adjustMenubar();
    currentWidth = window.innerWidth;
  }
});

// Format the values entered into a text input for either price or mileage
const numberInputs = document.querySelectorAll('input[data-type="number"]');
numberInputs.forEach((input) => {
  const inp = input;
  inp.onkeyup = function formatEntry() {
    const val = this.value;
    if (this.classList.contains('price')) this.value = formatCurrency(val);
    else if (this.classList.contains('mileage')) this.value = formatKilometer(val);
  };
});

// logout funtionality
const logout = document.querySelector('.logout');
if (logout !== null) {
  logout.onclick = () => {
    sessionStorage.clear();
    document.location.href = './index.html';
  };
}
