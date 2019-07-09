const first_name = document.getElementById('first-name');
const last_name = document.getElementById('last-name');
const email = document.getElementById('email');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');
const street = document.getElementById('street');
const city = document.getElementById('city');
const state = document.getElementById('state');
const country = document.getElementById('country');

const errorDiv = document.getElementById('error-div');
const signupBtn = document.getElementById('signup-btn');
const phone = document.getElementById('phone');
const zip = document.getElementById('zip-code');

const captchaBox = document.querySelector('.captcha-display');
const captchaInput = document.getElementById('captcha-text');
let correctCode;

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

phone.onkeyup = () => {
	phone.value = phone.value.replace(/\D/g, '');
};
zip.onkeyup = () => {
	zip.value = zip.value.replace(/\D/g, '');
};

// Validation function
const validateForm = () => {
	const errorFields = [];
	if (first_name.value === '') errorFields.push('fname');
	if (last_name.value === '') errorFields.push('lname');
	if (email.value === '') errorFields.push('no-email');
	else if (!(/\S+@\S+\.\S+/.test(email.value))) {
		errorFields.push('bad-email');
	}
	if (password1.value.length < 8) errorFields.push('short-pass');
	else if (password1.value.search(/\d/) < 0) errorFields.push('no-digit-in-pass');
	else if (password1.value.search(/[!@#$%^&*(),.?":{}|<>]/) < 0) errorFields.push('no-special-in-pass');
	else if (password1.value !== password2.value) errorFields.push('pass-mismatch');
	if (phone.value	!== '') {
		if (phone.value.length < 10) errorFields.push('phone');
	}
	return errorFields;
};

const handleErrors = (errors) => {
	let errMsg = '';
	errors.map((err) => {
		if (err === 'fname') errMsg += 'first name cannot be empty<br/>';
		else if (err === 'lname') errMsg += 'last name cannot be empty<br/>';
		else if (err === 'no-email') errMsg += 'email cannot be empty<br/>';
		else if (err === 'bad-email') errMsg += 'your e-mail is badly formed<br/>';
		else if (err === 'short-pass') errMsg += 'password should be 8 or more characters<br/>';
		else if (err === 'no-digit-in-pass') errMsg += 'password should include at least a digit<br/>';
		else if (err === 'no-special-in-pass') errMsg += 'password should include at least one special symbol<br/>';
		else if (err === 'pass-mismatch') errMsg += 'your passwords do not match<br/>';
		else if (err === 'phone') errMsg += 'phone number should be 10 or more digits<br/>';
		else errMsg += 'check if all your entry is correct<br/>';
		errorDiv.classList.remove('hide');
		errorDiv.innerHTML = errMsg;
		return 0;
	});
};

signupBtn.onclick = (e) => {
	e.preventDefault();
	errorDiv.classList.add('hide');
	errorDiv.style.backgroundColor = '#a45';
	if (captchaInput.value !== correctCode) {
		errorDiv.innerHTML = 'Incorrect Captcha Code. Please try again.';
		errorDiv.classList.remove('hide');
		const { canvas, code } = createCaptcha();
		correctCode = code;
		captchaBox.innerHTML = '';
		captchaBox.appendChild(canvas);
		return 0;
	}
	const errors = validateForm();
	if (errors.length > 0) {
		handleErrors(errors);
	} else {
		// process the form
		signupBtn.innerHTML = 'Processing data...';
		signupBtn.disabled = 'disabled';
		const data = {
			first_name: first_name.value,
			last_name: last_name.value,
			email: email.value,
			password: password1.value,
			is_admin: false,
			street: street.value,
			city: city.value,
			state: state.value,
			country: country.value,
			phone: phone.value,
			zip: zip.value,
		};
		const options = {
			body: JSON.stringify(data),
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		};
		fetch(`${urlPrefix}/api/v1/auth/signup`, options)
		.then(res => res.json())
		.then((response) => {
			const res = response;
			if (res.status !== 201) {
				errorDiv.innerHTML = res.error;
			} else {
				errorDiv.style.backgroundColor = '#4b5';
				errorDiv.innerHTML = `Congratulations ${res.data.first_name} ${res.data.last_name}.<br>You have successfully
				registered on AutoMart with this e-mail address: ${res.data.email}.<br/>
				click <a href='/api/v1/signin'>here to sign into your account.</a>`;
			}
			signupBtn.innerHTML = 'Create Account';
			signupBtn.disabled = null;
		})
		.catch((error) => {
			errorDiv.innerHTML = errorMessage(error);
		})
		.finally(() => {
			errorDiv.classList.remove('hide');
		});
	}
	return 0;
};

window.onload = () => {
	const { canvas, code } = createCaptcha();
	correctCode = code;
  captchaBox.appendChild(canvas);
};
