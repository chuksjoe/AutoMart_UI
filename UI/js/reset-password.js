const email = document.getElementById('email');

const errorDiv = document.getElementById('error-div');
const resetPass = document.getElementById('reset-pass-btn');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

let success = false;

// Validation function
const validateForm = () => {
	const errorFields = [];
	if (email.value === '') errorFields.push('no-email');
	else if (!(/\S+@\S+\.\S+/.test(email.value))) {
		errorFields.push('bad-email');
	}
	return errorFields;
};

resetPass.onclick = (e) => {
	e.preventDefault();
	errorDiv.style.display = 'none';
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
			errorDiv.style.display = 'block';
			errorDiv.innerHTML = errMsg;
			return 0;
		});
	} else {
		// process the form
		resetPass.innerHTML = 'Processing data...';
		resetPass.disabled = 'disabled';
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(`${urlPrefix}/api/v1/user/${email.value}/reset_password`, options)
		.then((res) => {
			if (res.status === 204) {
				success = true;
				return 0;
			}
			return res.json();
		})
		.then((response) => {
			if (response.status !== 204) {
				errorDiv.innerHTML = response.error;
			}
		})
		.catch((err) => {
			errorDiv.innerHTML = err;
		})
		.finally(() => {
			if (success) {
				errorDiv.style.backgroundColor = '#4b5';
				errorDiv.innerHTML = `You have successfully reset your password.
				The reset password has been sent to the email you entered.`;
			}
			errorDiv.style.display = 'block';
			resetPass.innerHTML = 'Reset Password';
			resetPass.disabled = null;
		});
	}
};
