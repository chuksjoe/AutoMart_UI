const carPreview = document.getElementById('car-preview-overlay');
const notificationModal = document.getElementById('notification-overlay');
const confirmationModal = document.getElementById('confirmation-overlay');
const updatePriceModal = document.getElementById('update-price-overlay');
const closeUpdateModal = document.getElementById('close-update-modal');
const closeCarPreview = document.getElementById('close-car-preview');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');

const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

// used for selecting the right url for filtering
const currentPage = 'my-ads';

let hasUpdatedInfo = false;

/* ================ Helper funtions ================= */
const deleteAd = (params) => {
  const { id, name } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to delete<br/><b>${name}</b>?`;
  confirmationModal.style.display = 'block';
  toggleScroll();

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/car/${id}`, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = response.message;
        hasUpdatedInfo = true;
      } else {
        message.innerHTML = response.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
    })
    .catch((err) => {
      message.innerHTML = errorMessage(err);
      notificationModal.style.display = 'block';
    });
  };
  decline.onclick = (e) => {
    e.preventDefault();
    confirmationModal.style.display = 'none';
    toggleScroll();
  };
};

const openUpdateModal = (params) => {
  const {
    id, name, price, body_type,
  } = params;
  const updatePriceBtn = document.getElementById('update-price');

  document.querySelector('#update-price-overlay .c-details-mv').innerHTML = name;
  document.querySelector('#update-price-overlay .c-b-type').innerHTML = `(${body_type})`;
  document.querySelector('#update-price-overlay .c-price')
  .innerHTML = `Current Price:<br/>&#8358 ${parseInt(price, 10).toLocaleString('en-US')}`;

  updatePriceModal.style.display = 'block';
  toggleScroll();

  updatePriceBtn.onclick = (e) => {
    e.preventDefault();
    let new_price = document.querySelector('.update-price-form .price').value;
    new_price = new_price.replace(/\D/g, '');
    if (new_price === '') {
      message.innerHTML = 'The price field cannot be empty!';
      notificationModal.style.display = 'block';
      return 0;
    }

    const options = {
      method: 'PATCH',
      body: JSON.stringify({ price: new_price }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/car/${id}/price`, options)
    .then(res => res.json())
    .then((response) => {
      const res = response;
      if (res.status === 200) {
        message.innerHTML = `You have successfully updated the price for <b>${res.data.name}.</b><br/><br/>
        Old Price: &#8358 ${parseInt(price, 10).toLocaleString('en-US')}<br/>
        New Price: &#8358 ${parseInt(res.data.price, 10).toLocaleString('en-US')}`;
        hasUpdatedInfo = true;
      } else {
        message.innerHTML = res.error;
      }
      updatePriceModal.style.display = 'none';
      notificationModal.style.display = 'block';
    })
    .catch((err) => {
      message.innerHTML = errorMessage(err);
      notificationModal.style.display = 'block';
    });
    return 0;
  };
};

const updateAdStatus = (params) => {
  const { id, name } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to mark<br/><b>${name}</b><br/>as sold?`;
  confirmationModal.style.display = 'block';
  toggleScroll();

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/car/${id}/status`, options)
    .then(res => res.json())
    .then((response) => {
      const res = response;
      if (res.status === 200) {
        message.innerHTML = res.message;
        hasUpdatedInfo = true;
      } else {
        message.innerHTML = res.error;
      }
      confirmationModal.style.display = 'none';
      notificationModal.style.display = 'block';
    })
    .catch((err) => {
      message.innerHTML = errorMessage(err);
      notificationModal.style.display = 'block';
    });
  };
  decline.onclick = (e) => {
    e.preventDefault();
    confirmationModal.style.display = 'none';
    toggleScroll();
  };
};

const fetchCarAds = (url, msgIfEmpty) => {
  const options = {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  };
  const carList = document.querySelector('.car-list');
  carList.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';
  fetch(url, options)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      carList.innerHTML = null;
      res.data.map((car) => {
        const {
          id, name, body_type, state, status, price, image_url, created_on,
        } = car;
        const carCard = document.createElement('li');
        const carImg = document.createElement('div');
        const carInfo = document.createElement('div');
        const btnGrp = document.createElement('div');
        const updatePriceBtn = document.createElement('button');
        const markSoldBtn = document.createElement('button');
        const deleteAdBtn = document.createElement('button');

        carCard.setAttribute('class', 'car-card flex-container');
        carImg.classList.add('car-image');
        carImg.innerHTML = `<img src="${image_url}" title="Preview AD">
            <label class="car-state-tag">${state}</label>`;
        carImg.onclick = () => {
          const btnGrpPrev = document.createElement('div');
          const markSoldBtnPrev = document.createElement('button');
          const deleteAdBtnPrev = document.createElement('button');

          markSoldBtnPrev.setAttribute('class', 'half-btn btn');
          markSoldBtnPrev.innerHTML = 'Mark Sold';
          markSoldBtnPrev.onclick = () => {
            updateAdStatus({ id, name });
          };
          deleteAdBtnPrev.setAttribute('class', 'delete half-btn btn');
          deleteAdBtnPrev.innerHTML = 'Delete Ad';
          deleteAdBtnPrev.onclick = () => {
            deleteAd({ id, name });
          };
          if (status === 'Sold') {
            markSoldBtnPrev.setAttribute('disabled', 'disabled');
          }

          btnGrpPrev.setAttribute('class', 'btn-group flex-container');
          btnGrpPrev.appendChild(markSoldBtnPrev);
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
                            <p>Posted on: ${configDate(created_on)}</p>`;

        updatePriceBtn.setAttribute('class', 'update-p full-btn btn');
        updatePriceBtn.innerHTML = 'Update Price';
        updatePriceBtn.onclick = () => {
          openUpdateModal({
            id, name, price, body_type,
          });
        };
        markSoldBtn.setAttribute('class', 'mark-sold full-btn btn');
        markSoldBtn.innerHTML = 'Mark Sold';
        markSoldBtn.onclick = () => {
          updateAdStatus({ id, name });
        };
        if (status === 'Sold') {
          updatePriceBtn.setAttribute('disabled', 'disabled');
          markSoldBtn.setAttribute('disabled', 'disabled');
        }
        deleteAdBtn.setAttribute('class', 'delete full-btn btn');
        deleteAdBtn.innerHTML = 'Delete Ad';
        deleteAdBtn.onclick = () => {
          deleteAd({ id, name });
        };
        btnGrp.setAttribute('class', 'user-actions');
        btnGrp.appendChild(updatePriceBtn);
        btnGrp.appendChild(markSoldBtn);
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
    message.innerHTML = errorMessage(error);
    carList.innerHTML = errorMessage(error);
    notificationModal.style.display = 'block';
    toggleScroll();
  });
};

/* ==================== MAIN LOGICS ====================== */
window.onload = () => {
  // redirect to sign in page if the user is not logged in
  if (!is_loggedin) {
    window.location.href = './signin.html';
  }

  const userName = document.querySelector('.user-name');

  userName.innerHTML = `${sessionStorage.getItem('first_name')}
   ${sessionStorage.getItem('last_name').charAt(0)}.`;

  // fetch the cars from database and populate the marketplace
  fetchCarAds(`${urlPrefix}/api/v1/car?owner_id=${user_id}`, 'You have not posted any car sale AD.');
};

closeCarPreview.onclick = () => {
  carPreview.style.display = 'none';
  toggleScroll();
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  toggleScroll();
  if (hasUpdatedInfo) autoRefresh(0);
};

closeUpdateModal.onclick = (e) => {
  e.preventDefault();
  updatePriceModal.style.display = 'none';
  document.querySelector('.update-price-form .price').value = null;
  toggleScroll();
};
