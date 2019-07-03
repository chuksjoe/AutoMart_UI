const notificationModal = document.getElementById('notification-overlay');
const closeNotifation = document.querySelector('.close-notification');
const confirmationModal = document.getElementById('confirmation-overlay');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');


const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

const reactToOffer = (params) => {
  const {
    id, car_name, price, price_offered, buyer_name, action,
  } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to ${action} offer<br/>for <b>${car_name}</b><br/>from ${buyer_name}?`;
  confirmationModal.style.display = 'block';

  confirm.onclick = (e) => {
    e.preventDefault();
    const init = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/order/${id}/${action}`, init)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = `
        You have successfully <b>${action}ed</b> ${buyer_name}'s offer for
        <b>${car_name}</b><br/>Price of Car: ${parseInt(price, 10).toLocaleString('en-US')}<br/>
        Price Offered: ${parseInt(price_offered, 10).toLocaleString('en-US')}`;
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

  const init = {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  };
  fetch(`${urlPrefix}/api/v1/sale`, init)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      historyList.innerHTML = null;
      res.data.map((order) => {
        const {
          id, car_name, price, buyer_name,
          price_offered, created_on, status,
        } = order;
        const orderCard = document.createElement('li');
        const btnGrp = document.createElement('div');
        const acceptOrderBtn = document.createElement('button');
        const declineOrderBtn = document.createElement('button');

        orderCard.setAttribute('class', 'history-list-item flex-container');
        const setBackground = status === 'Rejected' ? '#D61313' : '#48F038';
        orderCard.innerHTML = `
        <div class="purchase-date p-15">
					<p>${configDate(created_on)}</p>
					<label class="status"
          style="background:${status !== 'Pending' ? setBackground : null}">
          ${status}</label>
				</div>
				<div class="purchase-details p-15">
					<h3 class="c-details-list">Purchase Order from ${buyer_name}</h3>
					<p class="purchase-info">For ${car_name} @ &#8358 ${parseInt(price, 10).toLocaleString('en-US')}</p>
					<p class="purchase-info">Price Offered: &#8358 ${parseInt(price_offered, 10).toLocaleString('en-US')}</p>
				</div>`;
        btnGrp.setAttribute('class', 'user-actions p-15');
				acceptOrderBtn.setAttribute('class', 'update-p full-btn btn');
				acceptOrderBtn.innerHTML = 'Accept Offer';
				acceptOrderBtn.onclick = () => {
					reactToOffer({
						id, car_name, price, price_offered, buyer_name, action: 'accept',
					});
				};
        declineOrderBtn.setAttribute('class', 'delete full-btn btn');
				declineOrderBtn.innerHTML = 'Decline Offer';
				declineOrderBtn.onclick = () => {
					reactToOffer({
						id, car_name, price, price_offered, buyer_name, action: 'reject',
					});
				};
        if (status !== 'Pending') {
          acceptOrderBtn.setAttribute('disabled', 'disabled');
          declineOrderBtn.setAttribute('disabled', 'disabled');
        }
        btnGrp.appendChild(acceptOrderBtn);
				btnGrp.appendChild(declineOrderBtn);

				orderCard.appendChild(btnGrp);
				historyList.appendChild(orderCard);
				return 0;
      });
    } else {
      // the car list is empty
      historyList.style.textAlign = 'center';
      historyList.innerHTML = 'No order has been placed on any of your car AD.';
    }
  })
  .catch((error) => {
    message.innerHTML = `${error}<br/>Ensure you are connected to the internet.<br/>Click on Close to refresh page.`;
    notificationModal.style.display = 'block';
    toggleScroll();
  });
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  autoRefresh(0);
};
