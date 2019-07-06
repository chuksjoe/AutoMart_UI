const memberNav = document.querySelector('.member-nav');
const visitorNav = document.querySelector('.visitor-nav');

const carPreview = document.getElementById('car-preview-overlay');
const purchaseModal = document.getElementById('purchase-order-overlay');
const fraudModal = document.getElementById('fraudulent-flag-overlay');
const notificationModal = document.getElementById('notification-overlay');
const closeCarPreview = document.getElementById('close-car-preview');
const closePurModal = document.getElementById('close-purchase-modal');
const closeFraudModal = document.getElementById('close-fraud-modal');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');

const userName = document.querySelector('.user-name');
const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

// used for selecting the right url for filtering
const currentPage = 'marketplace';

/* ================ Helper funtions ================= */
const toggleNavBar = (is_logged, display = 'flex') => {
  if (is_logged) {
    // display marketplace with nav bar for logged in users
    visitorNav.style.display = 'none';
    userName.innerHTML = `${sessionStorage.getItem('first_name')}
      ${sessionStorage.getItem('last_name').charAt(0)}.`;
    memberNav.style.display = display;
  } else {
    // display marketplace with nav bar for a users that is not logged in
    memberNav.style.display = 'none';
    visitorNav.style.display = display;
  }
};

const displayNavBar = () => {
  if (window.innerWidth < 750) {
    toggleNavBar(is_loggedin, 'block');
  } else {
    toggleNavBar(is_loggedin);
  }
};

// open purchase order modal
const openPurchaseModal = (params) => {
  const {
    id, name, price, body_type,
  } = params;
  const placeOrderBtn = document.getElementById('place-order');

  document.querySelector('#purchase-order-overlay .c-details-mv').innerHTML = name;
  document.querySelector('#purchase-order-overlay .c-b-type').innerHTML = `(${body_type})`;
  document.querySelector('#purchase-order-overlay .c-price')
  .innerHTML = `&#8358 ${parseInt(price, 10).toLocaleString('en-US')}`;

  purchaseModal.style.display = 'block';
  toggleScroll();

  placeOrderBtn.onclick = (e) => {
    e.preventDefault();
    let price_offered = document.querySelector('.purchase-order-form .price').value;
    price_offered = price_offered.replace(/\D/g, '');
    if (price_offered === '') {
      message.innerHTML = 'The price field cannot be empty!';
      notificationModal.style.display = 'block';
      return 0;
    }

    const data = { car_id: id, price_offered };
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/order`, options)
    .then(res => res.json())
    .then((response) => {
      const res = response;
      if (res.status === 201) {
        message.innerHTML = `You have successfully placed an order for <b>${res.data.car_name}</b>.<br/><br/>
        Actual Price: &#8358 ${parseInt(res.data.price, 10).toLocaleString('en-US')}<br/>
        Price Offered: &#8358 ${parseInt(res.data.price_offered, 10).toLocaleString('en-US')}`;
      } else {
        message.innerHTML = res.error;
      }
      purchaseModal.style.display = 'none';
      notificationModal.style.display = 'block';
    })
    .catch((err) => {
      message.innerHTML = errorMessage(err);
      notificationModal.style.display = 'block';
    });
    return 0;
  };
};

// open fraudulent flagging modal
const openFraudModal = (params) => {
  const {
    id, name, price, body_type,
  } = params;
  const flagAdBtn = document.getElementById('flag-ad');

  document.querySelector('#fraudulent-flag-overlay .c-details-mv').innerHTML = name;
  document.querySelector('#fraudulent-flag-overlay .c-b-type').innerHTML = `(${body_type})`;
  document.querySelector('#fraudulent-flag-overlay .c-price')
  .innerHTML = `&#8358 ${parseInt(price, 10).toLocaleString('en-US')}`;

  fraudModal.style.display = 'block';
  toggleScroll();

  flagAdBtn.onclick = (e) => {
    e.preventDefault();
    const reason = document.querySelector('.flagging-form .reason').value;
    const description = document.querySelector('.flagging-form .description').value;
    if (reason.length < 3 || description.length <= 1) {
      message.innerHTML = 'Ensure you select a reason for your flag, and a description of the flag is given.';
      notificationModal.style.display = 'block';
      return 0;
    }

    const data = { car_id: id, reason, description };
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/flag`, options)
    .then(res => res.json())
    .then((response) => {
      const res = response;
      if (res.status === 201) {
        message.innerHTML = `${res.message}<br/>Car Ad Owner: ${res.data.owner_name}`;
        document.querySelector('.flagging-form .reason').value = null;
        document.querySelector('.flagging-form .description').value = null;
      } else {
        message.innerHTML = res.error;
      }
      purchaseModal.style.display = 'none';
      notificationModal.style.display = 'block';
    })
    .catch((err) => {
      message.innerHTML = errorMessage(err);
      notificationModal.style.display = 'block';
    });
    return 0;
  };
};

// get all the cars
const fetchCarAds = (url, msgIfEmpty) => {
  const carList = document.querySelector('.car-list');
  carList.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';
  fetch(url)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      carList.innerHTML = null;
      res.data.map((car) => {
        const {
          id, name, model, body_type, manufacturer, year, state, price, img_url, owner_id,
        } = car;
        const carCard = document.createElement('li');
        const carImg = document.createElement('div');
        const carInfo = document.createElement('div');
        const orderBtn = document.createElement('button');
        carCard.classList.add('car-card');
        carCard.setAttribute('data-id', id);
        carImg.classList.add('car-image');
        carImg.onclick = () => {
          const btnGrp = document.createElement('div');
          const orderBtnOnPrev = document.createElement('button');
          const flagBtn = document.createElement('button');
          btnGrp.setAttribute('class', 'btn-group flex-container');
          orderBtnOnPrev.setAttribute('class', 'half-btn btn');
          orderBtnOnPrev.onclick = () => {
            if (is_loggedin) {
              openPurchaseModal({
                id, name, price, body_type,
              });
            } else {
              message.innerHTML = `Please ensure you are logged-in before placing an order.<br/>
              If you don't have an account on AutoMart,<br/><a href='./signup.html'>Click here to Sign-up.</a>
              <br/>else,<br/><a href='./signin.html'>Click here to Sign-in.</a>`;
              notificationModal.style.display = 'block';
              toggleScroll();
            }
          };
          orderBtnOnPrev.innerHTML = 'Place Order';
          flagBtn.setAttribute('class', 'half-btn btn');
          flagBtn.onclick = () => {
            if (is_loggedin) {
              openFraudModal({
                id, name, price, body_type,
              });
            } else {
              message.innerHTML = `Please ensure you are logged-in before flagging an AD.<br/>
              If you don't have an account on AutoMart,<br/><a href='./signup.html'>Click here to Sign-up.</a>
              <br/>else,<br/><a href='./signin.html'>Click here to Sign-in.</a>`;
              notificationModal.style.display = 'block';
              toggleScroll();
            }
          };
          flagBtn.innerHTML = 'Flag Fradulent AD';
          if (owner_id === parseInt(user_id, 10)) {
            orderBtnOnPrev.setAttribute('disabled', 'disabled');
            flagBtn.setAttribute('disabled', 'disabled');
          }
          btnGrp.appendChild(orderBtnOnPrev);
          btnGrp.appendChild(flagBtn);

          // call the previewCar function defined in preview-car.js
          previewCar(id, btnGrp);

          carPreview.style.display = 'block';
          toggleScroll();
        };
        carInfo.classList.add('car-info');
        orderBtn.classList.add('order', 'full-btn', 'btn');
        orderBtn.onclick = () => {
          if (is_loggedin) {
            openPurchaseModal({
              id, name, price, body_type,
            });
          } else {
            message.innerHTML = `Please ensure you are logged-in before placing an order.<br/>
            If you don't have an account on AutoMart,<br/><a href='./signup.html'>Click here to Sign-up.</a>
            <br/>else,<br/><a href='./signin.html'>Click here to Sign-in.</a>`;
            notificationModal.style.display = 'block';
            toggleScroll();
          }
        };
        orderBtn.innerHTML = 'Place Order';
        if (owner_id === parseInt(user_id, 10)) {
          orderBtn.setAttribute('disabled', 'disabled');
        }
        carImg.innerHTML = `<img src="${img_url}" title="Preview AD">
            <label class="car-state-tag">${state}</label>`;
        carInfo.innerHTML = `<h3 class="c-details-mv">${year} ${manufacturer}<br>${model}</h3>
            <p class="car-price">&#8358 ${parseInt(price, 10).toLocaleString('en-US')}</p>`;
        carInfo.appendChild(orderBtn);
        carCard.appendChild(carImg);
        carCard.appendChild(carInfo);
        carList.appendChild(carCard);
        return 0;
      });
    } else {
      // the car list is empty
      carList.innerHTML = msgIfEmpty;
    }
  })
  .catch((error) => {
    message.innerHTML = errorMessage(error);
    notificationModal.style.display = 'block';
    carList.innerHTML = errorMessage(error);
    toggleScroll();
  });
};

/* ==================== MAIN LOGICS ====================== */
window.onload = () => {
  // Setup the right Nav Bar depending on whether the user is registered or not
  displayNavBar();

  // fetch the cars from database and populate the marketplace
   fetchCarAds(`${urlPrefix}/api/v1/car?status=Available`, 'No car ad found!');
};

// if the window is resized, it should check on the nav bar, and make neccesary adjustments
window.addEventListener('resize', () => {
  displayNavBar();
});

closeCarPreview.onclick = () => {
  carPreview.style.display = 'none';
  toggleScroll();
};

// close purchase car form modal view
closePurModal.onclick = (e) => {
  e.preventDefault();
  purchaseModal.style.display = 'none';
  toggleScroll();
};

// close mark post as fraudulent modal view
closeFraudModal.onclick = (e) => {
  e.preventDefault();
  fraudModal.style.display = 'none';
  document.querySelector('.flagging-form .reason').value = null;
  document.querySelector('.flagging-form .description').value = null;
  toggleScroll();
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  toggleScroll();
};
