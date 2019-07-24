const changePassBtn = document.querySelector('.change-pass-btn');
const passPreview = document.querySelector('.pass-preview');
const passEdit = document.querySelector('.pass-edit');
const cancelPassBtn = document.querySelector('.cancel-pass');
const savePassBtn = document.querySelector('.save-pass');

const editContactBtn = document.querySelector('.edit-contact-btn');
const contactInputs = document.querySelectorAll('.contact-input');
const contactPreviews = document.querySelectorAll('.contact');
const cancelContactBtn = document.querySelector('.cancel-contact');
const saveContactBtn = document.querySelector('.save-contact');

const notificationModal = document.getElementById('notification-overlay');
const closeNotifation = document.querySelector('.close-notification');
const message = document.querySelector('#notification-overlay .message');

const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');
const userEmail = sessionStorage.getItem('email');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

let userContact = null;
let hasUpdatedInfo = false;

changePassBtn.onclick = () => {
	passPreview.style.display = 'none';
	passEdit.style.display = 'block';
};

cancelPassBtn.onclick = () => {
	passPreview.style.display = 'block';
	passEdit.style.display = 'none';
};

// Validation function
const validatePasswords = (p0, p1, p2) => {
	const errorFields = [];
	if (p0.value === '') errorFields.push('current-blank');
	else if (p0.value === p1.value) errorFields.push('same-pass');
	else if (p1.value.length < 8) errorFields.push('short-pass');
	else if (p1.value.search(/\d/) < 0) errorFields.push('no-digit-in-pass');
	else if (p1.value.search(/[!@#$%^&*(),.?":{}|<>]/) < 0) errorFields.push('no-special-in-pass');
	else if (p1.value !== p2.value) errorFields.push('pass-mismatch');
	return errorFields;
};

const handleErrors = (errors, div) => {
	const errorDiv = div;
	let errMsg = '';
	errors.map((err) => {
		if (err === 'current-blank') errMsg += 'current password cannot be blank<br/>';
		else if (err === 'same-pass') errMsg += 'new password must be different from current password<br/>';
		else if (err === 'short-pass') errMsg += 'password should be 8 or more characters<br/>';
		else if (err === 'no-digit-in-pass') errMsg += 'password should include at least a digit<br/>';
		else if (err === 'no-special-in-pass') errMsg += 'password should include at least one special symbol<br/>';
		else if (err === 'pass-mismatch') errMsg += 'your passwords do not match<br/>';
		else if (err === 'phone') errMsg += 'phone number should be 10 or more digits<br/>';
		else errMsg += 'check if all your entry is correct<br/>';
		errorDiv.style.display = 'block';
		errorDiv.innerHTML = errMsg;
		return 0;
	});
};

savePassBtn.onclick = () => {
	const password0 = document.getElementById('password0');
	const password1 = document.getElementById('password1');
	const password2 = document.getElementById('password2');
	const errorDiv = document.querySelector('.error-div-pass');

	errorDiv.style.display = 'none';
	const errors = validatePasswords(password0, password1, password2);
	if (errors.length > 0) {
		handleErrors(errors, errorDiv);
	} else {
		savePassBtn.innerHTML = 'Processing data...';
		savePassBtn.disabled = 'disabled';
		const data = { password: password0.value, new_password: password1.value };
		const options = {
			body: JSON.stringify(data),
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		};
		fetch(`${urlPrefix}/api/v1/user/${userEmail}/reset_password`, options)
		.then((res) => {
			if (res.status === 204) {
				hasUpdatedInfo = true;
				return 0;
			}
			return res.json();
		})
		.then((response) => {
			if (response.status !== 204) {
				message.innerHTML = response.error;
				notificationModal.style.display = 'block';
			}
		})
		.catch((err) => {
			errorDiv.innerHTML = errorMessage(err);
			errorDiv.style.display = 'block';
		})
		.finally(() => {
			if (hasUpdatedInfo) {
				message.innerHTML = `You have successfully changed your password.
				An email which contains your new password has been sent to you.`;
				notificationModal.style.display = 'block';
			}
			savePassBtn.innerHTML = 'Save';
			savePassBtn.disabled = null;
		});
	}
};

editContactBtn.onclick = () => {
	contactInputs.forEach((i, index) => {
		const input = i;
		input.value = userContact[index];
		input.style.display = 'block';
	});
	contactPreviews.forEach((p) => {
		const preview = p;
		preview.style.display = 'none';
	});
	editContactBtn.style.display = 'none';
};

cancelContactBtn.onclick = () => {
	contactInputs.forEach((i) => {
		const input = i;
		input.style.display = 'none';
	});
	contactPreviews.forEach((p) => {
		const preview = p;
		preview.style.display = 'block';
	});
	editContactBtn.style.display = 'block';
};

saveContactBtn.onclick = () => {
	const street = document.getElementById('street');
	const city = document.getElementById('city');
	const state = document.getElementById('state');
	const country = document.getElementById('country');

	const phone = document.getElementById('phone');
	const zip = document.getElementById('zip-code');
	const errorDiv = document.querySelector('.error-div-contact');

	errorDiv.style.display = 'none';
	if (phone.value	!== '' && (phone.value.length < 10 || /\D/.test(phone.value))) {
		errorDiv.style.display = 'block';
		errorDiv.innerHTML = 'phone number should be 10 or more digits';
	} else {
		saveContactBtn.innerHTML = 'Processing data...';
		saveContactBtn.disabled = 'disabled';
		const data = {
			street: street.value,
			city: city.value,
			state: state.value,
			country: country.value,
			phone: phone.value,
			zip: zip.value,
		};
		const options = {
			body: JSON.stringify(data),
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
		};
		fetch(`${urlPrefix}/api/v1/user/${userEmail}/update_details`, options)
		.then(res => res.json())
		.then((response) => {
			if (response.status !== 200) {
				message.innerHTML = response.error;
				notificationModal.style.display = 'block';
			} else {
				message.innerHTML = 'You have successfully updated your contact details.';
				notificationModal.style.display = 'block';
				hasUpdatedInfo = true;
			}
		})
		.catch((err) => {
			errorDiv.innerHTML = errorMessage(err);
			errorDiv.style.display = 'block';
		})
		.finally(() => {
			saveContactBtn.innerHTML = 'Save';
			saveContactBtn.disabled = null;
		});
	}
};

window.onload = () => {
  // redirect to sign in page if the user is not logged in
  if (!is_loggedin) {
    window.location.href = './signin.html';
  }

  const userName = document.querySelector('.user-name');

  userName.innerHTML = `${sessionStorage.getItem('first_name')}
   ${sessionStorage.getItem('last_name').charAt(0)}.`;

  // fetch user's info from database
  const loader = document.querySelector('#loading');
  const userInfo = document.querySelector('.main-100');
  const options = {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  };

  fetch(`${urlPrefix}/api/v1/user/${user_id}`, options)
  .then(res => res.json())
  .then((response) => {
    const res = response;
    if (res.status === 200) {
      const nonEditableInfo = document.querySelector('.non-editable-info');
      const {
				email, first_name, last_name, street, city, state, last_online,
				country, phone, zip, registered_on, num_of_ads, num_of_orders,
      } = res.data;

      document.querySelector('.full-name').innerHTML = `${first_name} ${last_name}`;
      nonEditableInfo.innerHTML = `
      <div class = "input-field single">
				<label for="email">E-mail:</label>
				<label class="contact">${email}</label>
			</div>
			<div class="input-group flex-container">
				<div class = "input-field">
					<label>Posted Car Ads Count:</label>
					<label class="contact">${num_of_ads}</label>
				</div>
				<div class = "input-field">
					<label>Purchase Order Count:</label>
					<label class="contact">${num_of_orders}</label>
				</div>
			</div>
			<div class="input-group flex-container">
				<div class = "input-field">
					<label>Registered on:</label>
					<label class="contact">${configDate(registered_on)}</label>
				</div>
				<div class = "input-field">
					<label>Last on-line:</label>
					<label class="contact">${configDate(last_online)}</label>
				</div>
			</div>`;
			document.querySelector('.street').innerHTML = street;
			document.querySelector('.city').innerHTML = city;
			document.querySelector('.state').innerHTML = state;
			document.querySelector('.country').innerHTML = country;
			document.querySelector('.phone').innerHTML = phone;
			document.querySelector('.zip-code').innerHTML = zip;
			userContact = [street, city, state, country, phone, zip];
			userInfo.style.display = 'block';
    } else {
      // the purchase list is empty
      message.innerHTML = res.error;
      notificationModal.style.display = 'block';
    }
  })
  .catch((error) => {
    message.innerHTML = errorMessage(error);
    notificationModal.style.display = 'block';
    userInfo.style.display = 'block';
    userInfo.innerHTML = errorMessage(error);
    toggleScroll();
  })
  .finally(() => {
		loader.style.display = 'none';
  });
};

closeNotifation.onclick = (e) => {
  e.preventDefault();
  notificationModal.style.display = 'none';
  if (hasUpdatedInfo) autoRefresh(0);
  toggleScroll();
};
