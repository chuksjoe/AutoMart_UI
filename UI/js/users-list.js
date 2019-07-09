const notificationModal = document.getElementById('notification-overlay');
const closeNotifation = document.querySelector('.close-notification');
const confirmationModal = document.getElementById('confirmation-overlay');
const message = document.querySelector('#notification-overlay .message');
const confMsg = document.querySelector('#confirmation-overlay .message');

const is_loggedin = sessionStorage.getItem('is_loggedin');
const is_admin = sessionStorage.getItem('is_admin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

let hasUpdatedInfo = false;

/* ================ Helper funtions ================= */
const deleteUser = (params) => {
  const { email, first_name, last_name } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to delete<br/><b>${first_name} ${last_name}</b><br/>
  with all resources attached to him/her from AutoMart database?`;
  confirmationModal.style.display = 'block';
  toggleScroll();

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/user/${email}`, options)
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

const makeAdmin = (params) => {
  const { email, first_name, last_name } = params;
  const confirm = document.querySelector('#confirmation-overlay .yes');
  const decline = document.querySelector('#confirmation-overlay .no');

  confMsg.innerHTML = `Are you sure you want to upgrade<br/><b>${first_name} ${last_name}</b><br/>
  to the status of an ADMIN?`;
  confirmationModal.style.display = 'block';
  toggleScroll();

  confirm.onclick = (e) => {
    e.preventDefault();
    const options = {
      method: 'PATCH',
      body: JSON.stringify({ is_admin: true }),
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
    };
    fetch(`${urlPrefix}/api/v1/user/${email}/update_details`, options)
    .then(res => res.json())
    .then((response) => {
      if (response.status === 200) {
        message.innerHTML = `You have successfully upgraded<br/><b>${first_name} ${last_name}</b><br/>
        to the status of an <b>ADMIN</b>.`;
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
        const makeAdminBtn = document.createElement('button');
        const deleteUserBtn = document.createElement('button');

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
        makeAdminBtn.setAttribute('class', 'suspend full-btn btn');
        makeAdminBtn.innerHTML = 'Make Admin';
        makeAdminBtn.onclick = () => {
          makeAdmin({ email, first_name, last_name });
        };
        deleteUserBtn.setAttribute('class', 'delete full-btn btn');
        deleteUserBtn.innerHTML = 'Delete Account';
        deleteUserBtn.onclick = () => {
          deleteUser({ email, first_name, last_name });
        };
        if (isAdmin) {
          makeAdminBtn.setAttribute('disabled', 'disabled');
          deleteUserBtn.setAttribute('disabled', 'disabled');
        }

        btnGrp.setAttribute('class', 'admin-actions p-15');
        btnGrp.appendChild(msgUser);
        btnGrp.appendChild(makeAdminBtn);
        btnGrp.appendChild(deleteUserBtn);

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
    message.innerHTML = errorMessage(error);
    userList.innerHTML = errorMessage(error);
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
  if (hasUpdatedInfo) autoRefresh(0);
  toggleScroll();
};
