const carPreview = document.getElementById('car-preview-overlay');
const notificationModal = document.getElementById('notification-overlay');
const confirmationModal = document.getElementById('confirmation-overlay');
const closeCarPreview = document.getElementById('close-car-preview');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');

const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const is_admin = sessionStorage.getItem('is_admin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

/* ================ Helper funtions ================= */
const deleteAd = (params) => {
  const {
    id, name, owner_id, owner_name,
  } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to delete<br/><b>${name}</b>
  <br/>owned by ${(owner_id === parseInt(user_id, 10) ? 'you' : owner_name)}?`;
  confirmationModal.style.display = 'block';

  confirm.onclick = (e) => {
    e.preventDefault();
    const init = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/car/${id}`, init)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = response.message;
      } else {
        message.innerHTML = response.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
      autoRefresh(3000);
    });
  };
  decline.onclick = (e) => {
    e.preventDefault();
    confirmationModal.style.display = 'none';
  };
};

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
          id, name, owner_id, owner_name, body_type, state, status, price, img_url, created_on,
        } = car;
        const carCard = document.createElement('li');
        const carImg = document.createElement('div');
        const carInfo = document.createElement('div');
        const btnGrp = document.createElement('div');
        const viewFlagsBtn = document.createElement('button');
        const deleteAdBtn = document.createElement('button');

        carCard.setAttribute('class', 'car-card flex-container');
        carImg.classList.add('car-image');
        carImg.innerHTML = `<img src="${img_url}" title="Preview AD">
            <label class="car-state-tag">${state}</label>`;
        carImg.onclick = () => {
          const btnGrpPrev = document.createElement('div');
          const viewFlagsBtnPrev = document.createElement('button');
          const deleteAdBtnPrev = document.createElement('button');

          viewFlagsBtnPrev.setAttribute('class', 'view-reports half-btn btn');
          viewFlagsBtnPrev.innerHTML = 'View Flags';
          deleteAdBtnPrev.setAttribute('class', 'delete half-btn btn');
          deleteAdBtnPrev.innerHTML = 'Delete Ad';
          deleteAdBtnPrev.onclick = () => {
            deleteAd({
              id, name, owner_id, owner_name,
            });
          };
          btnGrpPrev.setAttribute('class', 'btn-group flex-container');
          btnGrpPrev.appendChild(viewFlagsBtnPrev);
          btnGrpPrev.appendChild(deleteAdBtnPrev);

          // call the previewCar function defined in preview-car.js
          previewCar(id, btnGrpPrev);

          carPreview.style.display = 'block';
          toggleScroll();
        };

        carInfo.classList.add('car-info');
        carInfo.innerHTML = `<h3 class="c-details-list">${name}</h3>
                            <label class="car-status-tag">${status}</label>
                            <p class="car-price">&#8358 ${parseInt(price, 10).toLocaleString('en-US')}</p>
                            <p><b>Body type:</b> ${body_type}</p>
                            <p>Posted by ${owner_name}, on: ${configDate(created_on)}</p>`;

        viewFlagsBtn.setAttribute('class', 'view-reports full-btn btn');
        viewFlagsBtn.innerHTML = 'View Flags';
        deleteAdBtn.setAttribute('class', 'delete full-btn btn');
        deleteAdBtn.innerHTML = 'Delete Ad';
        deleteAdBtn.onclick = () => {
          deleteAd({
            id, name, owner_id, owner_name,
          });
        };
        btnGrp.setAttribute('class', 'admin-actions');
        btnGrp.appendChild(viewFlagsBtn);
        btnGrp.appendChild(deleteAdBtn);

        carCard.appendChild(carImg);
        carCard.appendChild(carInfo);
        carCard.appendChild(btnGrp);
        carList.appendChild(carCard);
        return 0;
      });
    } else {
      // the car list is empty
      carList.style.textAlign = 'center';
      carList.innerHTML = msgIfEmpty;
    }
  })
  .catch((error) => {
    message.innerHTML = error;
    notificationModal.style.display = 'block';
    toggleScroll();
  });
};

/* ==================== MAIN LOGICS ====================== */
window.onload = () => {
  // redirect to sign in page if the user is not logged in
  if (!(is_loggedin || is_admin)) {
    window.location.href = './signin.html';
  }
  const userName = document.querySelector('.user-name');

  userName.innerHTML = `${sessionStorage.getItem('first_name')}
   ${sessionStorage.getItem('last_name').charAt(0)}.`;

  // fetch the cars from database and populate the marketplace
  fetchCarAds(`${urlPrefix}/api/v1/car`, 'No car sale ad has been posted.');
};

closeCarPreview.onclick = () => {
  carPreview.style.display = 'none';
  toggleScroll();
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  document.location.reload();
};
