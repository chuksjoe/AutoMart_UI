const carPreview = document.getElementById('car-preview-overlay');
const flagList = document.getElementById('flag-listing-overlay');
const notificationModal = document.getElementById('notification-overlay');
const confirmationModal = document.getElementById('confirmation-overlay');
const closeCarPreview = document.getElementById('close-car-preview');
const closeFlagList = document.getElementById('close-flag-listing');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');

const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const is_admin = sessionStorage.getItem('is_admin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

/* ================ Helper funtions ================= */
const deleteFlag = (params) => {
  const {
    id, car_name, owner_name, owner_id,
  } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to delete<br/>flag with ID ${id} placed on<br/><b>${car_name}</b>
  <br/>owned by ${(owner_id === parseInt(user_id, 10) ? 'you' : owner_name)}?`;
  confirmationModal.style.display = 'block';

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/flag/${id}`, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = response.message;
        autoRefresh(3000);
      } else {
        message.innerHTML = response.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
    });
  };
  decline.onclick = (e) => {
    e.preventDefault();
    confirmationModal.style.display = 'none';
  };
};

const markAddressed = (params) => {
  const {
    id, car_name, owner_name, owner_id,
  } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to mark<br/>flag with ID ${id} placed on<br/><b>${car_name}</b>
  <br/>owned by ${(owner_id === parseInt(user_id, 10) ? 'you' : owner_name)} as Addressed?`;
  confirmationModal.style.display = 'block';

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'PATCH',
      headers: { authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/flag/${id}/status`, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = response.message;
        autoRefresh(3000);
      } else {
        message.innerHTML = response.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
    });
  };
  decline.onclick = (e) => {
    e.preventDefault();
    confirmationModal.style.display = 'none';
  };
};

const viewFlagList = (carId, carName) => {
  const flagListModal = document.querySelector('#flag-listing-overlay .flag-list');
  flagListModal.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';
  flagListModal.style.textAlign = 'left';
  document.querySelector('#flag-listing-overlay .modal-header').innerHTML = carName;
  flagList.style.display = 'block';
  toggleScroll();

  const options = {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  };
  fetch(`${urlPrefix}/api/v1/flag/${carId}`, options)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      flagListModal.innerHTML = null;
      res.data.map((flag) => {
        const {
          id, reporter_id, owner_name, owner_id, reason, description, status, created_on, car_name,
        } = flag;
        const flagCard = document.createElement('li');
        const btnGrp = document.createElement('div');
        const markAddressedBtn = document.createElement('button');
        const deleteFlagBtn = document.createElement('button');

        flagCard.setAttribute('class', 'flag-details flex-container');
        flagCard.innerHTML = `
        <div class="date-time p-15">
          <p>${configDate(created_on)}</p>
          <label class="f-status"
          style="background:${status === 'Pending' ? '#FEBD2D' : '#48F038'}">${status}</label>
        </div>
        <div class="flag-main-desc">
          <h3>Reason: ${reason}</h3>
          <p>Description: ${description}</p>
          <p>Car Owner: ${owner_name}, Reporter ID: ${reporter_id}, Flag ID: ${id}</p>
        </div>`;

        markAddressedBtn.setAttribute('class', 'mark-addressed full-btn btn');
        markAddressedBtn.innerHTML = 'Mark Addressed';
        markAddressedBtn.onclick = () => {
          markAddressed({
            id, car_name, owner_name, owner_id,
          });
        };
        deleteFlagBtn.setAttribute('class', 'del-flag delete full-btn btn');
        deleteFlagBtn.innerHTML = 'Delete Flag';
        deleteFlagBtn.onclick = () => {
          deleteFlag({
            id, car_name, owner_name, owner_id,
          });
        };

        btnGrp.setAttribute('class', 'flag-actions p-15');
        btnGrp.appendChild(markAddressedBtn);
        btnGrp.appendChild(deleteFlagBtn);

        flagCard.appendChild(btnGrp);
        flagListModal.appendChild(flagCard);
        return 0;
      });
    } else {
      // the car list is empty
      flagListModal.style.textAlign = 'center';
      flagListModal.innerHTML = 'This car Ad has not been flagged.';
    }
  })
  .catch((error) => {
    message.innerHTML = error;
    notificationModal.style.display = 'block';
    toggleScroll();
  });
};

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
    const options = {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/car/${id}`, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = response.message;
        autoRefresh(3000);
      } else {
        message.innerHTML = response.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
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
          viewFlagsBtnPrev.onclick = () => {
            viewFlagList(id, name);
          };
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

        viewFlagsBtn.setAttribute('class', 'view-reports full-btn btn b49');
        viewFlagsBtn.innerHTML = 'View Flags';
        viewFlagsBtn.onclick = () => {
          viewFlagList(id, name);
        };
        deleteAdBtn.setAttribute('class', 'delete full-btn btn b49');
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

closeFlagList.onclick = () => {
  flagList.style.display = 'none';
  toggleScroll();
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
};
