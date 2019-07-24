const updatePriceModal = document.getElementById('update-price-overlay');
const updatePriceBtn = document.getElementById('update-price');
const priceField = document.querySelector('.update-order-form .price');
const closeUpdateModal = document.getElementById('close-update-modal');
const notificationModal = document.getElementById('notification-overlay');
const confirmationModal = document.getElementById('confirmation-overlay');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');

const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

let hasUpdatedInfo = false;

/* ================ Helper funtions ================= */
const deleteAd = (params) => {
  const {
    id, car_name, owner, status, car_price, amount,
  } = params;
  const action = status === 'Pending' ? 'cancel' : 'delete';
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to ${action} your ${status} offer for<br/><b>${car_name}</b></br>
  owned by ${owner}?<hr/>Car Price: &#8358 ${parseInt(car_price, 10).toLocaleString('en-US')}<br/>
  Price you offered: &#8358 ${parseInt(amount, 10).toLocaleString('en-US')}`;
  confirmationModal.style.display = 'block';
  toggleScroll();

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/order/${id}`, options)
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
    id, car_name, car_price, car_body_type, amount,
  } = params;
  const orderInfo = document.querySelector('#update-price-overlay .order-info');

  orderInfo.innerHTML = `
  <h3 class="c-details-mv">${car_name}</h3>
  <p class="c-b-type">(${car_body_type})</p>
  <p class="c-price">Price: &#8358 ${parseInt(car_price, 10).toLocaleString('en-US')}</p><hr>
  <p class="c-c-o-price">
  Current Price Offered:<br>&#8358 ${parseInt(amount, 10).toLocaleString('en-US')}</p>`;

  updatePriceModal.style.display = 'block';
  toggleScroll();

  updatePriceBtn.onclick = (e) => {
    e.preventDefault();
    let new_price = document.querySelector('.update-order-form .price').value;
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
    fetch(`${urlPrefix}/api/v1/order/${id}/price`, options)
    .then(res => res.json())
    .then((response) => {
      const res = response;
      if (res.status === 200) {
        const { old_price_offered, new_price_offered } = res.data;
        message.innerHTML = `You have successfully updated the price you offered for <b>${res.data.car_name}.</b><br/><br/>
        Actual Price: &#8358 ${parseInt(res.data.car_price, 10).toLocaleString('en-US')}<br/>
        Old Price Offered: &#8358 ${parseInt(old_price_offered, 10).toLocaleString('en-US')}<br/>
        New Price Offered: &#8358 ${parseInt(new_price_offered, 10).toLocaleString('en-US')}`;
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

/* ============ MAIN LOGICS ========================= */
priceField.addEventListener('keyup', () => {
  const price = document.querySelector('.update-order-form .price').value;
  enablePriceSummitBtn(price, updatePriceBtn);
});

window.onload = () => {
	// redirect to sign in page if the user is not logged in
  if (!is_loggedin) {
    window.location.href = './signin.html';
	}

  const userName = document.querySelector('.user-name');

  userName.innerHTML = `${sessionStorage.getItem('first_name')}
   ${sessionStorage.getItem('last_name').charAt(0)}.`;

  // fetch the purchase orders from database and populate the purchase history page
  const historyList = document.querySelector('.history-list');
  historyList.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';

  const options = {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  };
  fetch(`${urlPrefix}/api/v1/order`, options)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      historyList.innerHTML = null;
      res.data.map((order) => {
        const {
          id, car_name, car_body_type, car_price, owner,
          amount, created_on, status,
        } = order;
        const orderCard = document.createElement('li');
        const btnGrp = document.createElement('div');
        const updateOrderBtn = document.createElement('button');
        const cancelOrderBtn = document.createElement('button');
        const setBackground = status === 'Rejected' ? '#D61313' : '#48F038';

        orderCard.setAttribute('class', 'history-list-item flex-container');
        orderCard.innerHTML = `
        <div class="purchase-date p-15">
					<p>${configDate(created_on)}</p>
					<label class="status"
          style="background:${status !== 'Pending' ? setBackground : null}">${status}</label>
				</div>
				<div class="purchase-details p-15">
					<h3 class="c-details-list">Purchase Order for ${car_name}</h3>
					<p class="purchase-info">Actual Price: &#8358 ${parseInt(car_price, 10).toLocaleString('en-US')}.
					Owner: ${owner}</p>
					<p class="purchase-info">Price Offered: &#8358 ${parseInt(amount, 10).toLocaleString('en-US')}</p>
				</div>`;
				btnGrp.setAttribute('class', 'user-actions p-15');
				updateOrderBtn.setAttribute('class', 'update-p full-btn btn');
				updateOrderBtn.innerHTML = 'Update Price';
				updateOrderBtn.onclick = () => {
					openUpdateModal({
						id, car_name, car_price, car_body_type, amount,
					});
				};
        if (status !== 'Pending') {
          updateOrderBtn.setAttribute('disabled', 'disabled');
        }
				cancelOrderBtn.setAttribute('class', 'delete full-btn btn');
				cancelOrderBtn.innerHTML = 'Cancel/Delete Offer';
        cancelOrderBtn.onclick = () => {
          deleteAd({
            id, car_name, owner, status, car_price, amount,
          });
        };

				btnGrp.appendChild(updateOrderBtn);
				btnGrp.appendChild(cancelOrderBtn);

				orderCard.appendChild(btnGrp);
				historyList.appendChild(orderCard);
				return 0;
      });
    } else {
      // the purchase list is empty
      historyList.style.textAlign = 'center';
      historyList.innerHTML = 'You have not placed any order yet!';
    }
  })
  .catch((error) => {
    message.innerHTML = errorMessage(error);
    historyList.innerHTML = errorMessage(error);
    notificationModal.style.display = 'block';
    toggleScroll();
  });
};

closeUpdateModal.onclick = (e) => {
  e.preventDefault();
  updatePriceModal.style.display = 'none';
  document.querySelector('.update-order-form .price').value = null;
  updatePriceBtn.setAttribute('disabled', 'disabled');
  toggleScroll();
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  if (hasUpdatedInfo) autoRefresh(0);
  toggleScroll();
};
