const notificationModal = document.getElementById('notification-overlay');
const closeNotifation = document.querySelector('.close-notification');

const is_loggedin = sessionStorage.getItem('is_loggedin');
const is_admin = sessionStorage.getItem('is_admin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

/* ================ Helper funtions ================= */

const fetchUsers = (url, msgIfEmpty) => {
  const userList = document.querySelector('.users-list');
  userList.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';
  const init = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
  };
  fetch(url, init)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.data.length > 0) {
      userList.innerHTML = null;
      res.data.map((user) => {
        const {
					id, email, first_name, last_name, registered_on, last_online, num_of_ads, num_of_orders,
        } = user;
        const isAdmin = user.is_admin;
        const userItem = document.createElement('li');
        const userDetails = document.createElement('div');
        const btnGrp = document.createElement('div');
        const msgUser = document.createElement('button');
        const suspendBtn = document.createElement('button');
        const deleteAdBtn = document.createElement('button');

        if (isAdmin) {
          userItem.style.backgroundColor = '#ccc';
        }
        userItem.setAttribute('class', 'user-list-item flex-container');
        userDetails.setAttribute('class', 'user-details p-15');
        userDetails.innerHTML = `
        <h3 class="user-name"><b>User Id:</b> ${id}.
         <b>Name:</b> ${first_name} ${last_name}${isAdmin ? '(ADMIN)' : ''}</h3>
				<p class="last-online"><b>Last online:</b> ${configDate(last_online)}</p>
				<p>
					<span class="email"><b>Email:</b> ${email}, </span>
					<span class="created-on"><b>Registered on:</b> ${configDate(registered_on)}, </span>
				</p>
				<p>
					<span class="ad-count"><b>Number of posted Ads:</b> ${num_of_ads}, </span>
					<span class="order-count"><b>Number of purchase orders:</b> ${num_of_orders}</span>
				</p>`;

        msgUser.setAttribute('class', 'send-msg full-btn btn');
        msgUser.innerHTML = 'Message User';
        suspendBtn.setAttribute('class', 'suspend full-btn btn');
        suspendBtn.innerHTML = 'Suspend User';
        deleteAdBtn.setAttribute('class', 'delete full-btn btn');
        deleteAdBtn.innerHTML = 'Delete Account';
        btnGrp.setAttribute('class', 'admin-actions p-15');
        btnGrp.appendChild(msgUser);
        btnGrp.appendChild(suspendBtn);
        btnGrp.appendChild(deleteAdBtn);

        userItem.appendChild(userDetails);
        userItem.appendChild(btnGrp);
        userList.appendChild(userItem);
        return 0;
      });
    } else {
      // the car list is empty
      userList.style.textAlign = 'center';
      userList.innerHTML = msgIfEmpty;
    }
  })
  .catch((error) => {
    const message = document.querySelector('#notification-overlay .message');
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
  fetchUsers(`${urlPrefix}/api/v1/user`, 'No car sale ad has been posted.');
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  document.location.reload();
};