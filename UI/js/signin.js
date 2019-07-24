const email = document.getElementById('email');
const password = document.getElementById('password');

const errorDiv = document.getElementById('error-div');
const signinBtn = document.getElementById('signin-btn');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

// Validation function
const validateForm = () => {
	const errorFields = [];
	if (email.value === '') errorFields.push('no-email');
	else if (!(/\S+@\S+\.\S+/.test(email.value))) {
		errorFields.push('bad-email');
	}
	return errorFields;
};

signinBtn.onclick = (e) => {
	e.preventDefault();
	errorDiv.classList.add('hide');
	errorDiv.style.backgroundColor = '#a45';
	const errors = validateForm();
	if (errors.length > 0) {
		let errMsg = '';
		errors.map((err) => {
			switch (err) {
				case 'no-email':
					errMsg += 'email cannot be empty<br/>';
					break;
				case 'bad-email':
					errMsg += 'your e-mail is badly formed<br/>';
					break;
				default: errMsg += 'check if all your entry is correct<br/>';
			}
			errorDiv.classList.remove('hide');
			errorDiv.innerHTML = errMsg;
			return 0;
		});
	} else {
		// process the form
		signinBtn.innerHTML = 'Processing data...';
		signinBtn.disabled = 'disabled';
		const data = {
			email: email.value,
			password: password.value,
		};
		const options = {
			body: JSON.stringify(data),
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(`${urlPrefix}/api/v1/auth/signin`, options)
		.then(res => res.json())
		.then((response) => {
			const res = response;
			if (res.status !== 200) {
				errorDiv.innerHTML = res.error;
				errorDiv.classList.remove('hide');
				signinBtn.innerHTML = 'Sign In';
				signinBtn.disabled = null;
			} else {
				errorDiv.classList.add('hide');
				sessionStorage.setItem('first_name', res.data.first_name);
				sessionStorage.setItem('last_name', res.data.last_name);
				sessionStorage.setItem('token', res.data.token);
				sessionStorage.setItem('email', res.data.email);
				sessionStorage.setItem('user_id', res.data.id);
				sessionStorage.setItem('is_admin', res.data.is_admin);
				sessionStorage.setItem('is_loggedin', true);

				if (res.data.is_admin) {
					setTimeout(() => {
						window.location.href = './admin.html';
					}, 1000);
				} else {
					setTimeout(() => {
						window.location.href = './marketplace.html';
					}, 1000);
				}
			}
		})
		.catch((error) => {
			errorDiv.innerHTML = errorMessage(error);
			signinBtn.disabled = null;
			errorDiv.classList.remove('hide');
			signinBtn.innerHTML = 'Sign In';
		});
	}
};
