const manufacturer = document.getElementById('manufacturer');
const model = document.getElementById('model');
const body_type = document.getElementById('body-type');
const year = document.getElementById('year');
const price = document.getElementById('price');
const state = document.getElementById('state');
const color = document.getElementById('color');
const mileage = document.getElementById('mileage');
const transmission_type = document.getElementById('transmission');
const fuel_type = document.getElementById('fuel-type');
const fuel_cap = document.getElementById('fuel-cap');
const doors = document.getElementById('doors');
const img_url = document.getElementById('upload-image');
const description = document.getElementById('description');

const ac = document.querySelector('input[value="ac"]');
const arm_rest = document.querySelector('input[value="arm_rest"]');
const fm_radio = document.querySelector('input[value="fm_radio"]');
const dvd_player = document.querySelector('input[value="dvd_player"]');
const tinted_windows = document.querySelector('input[value="tinted_windows"]');
const air_bag = document.querySelector('input[value="air_bag"]');

const previewBox = document.getElementById('preview-upload-image');

const form = document.querySelector('form');

const errorDiv = document.getElementById('error-div');
const postAdBtn = document.querySelector('.post-new-ad');

const user_id = sessionStorage.getItem('user_id');
const is_loggedin = sessionStorage.getItem('is_loggedin');
const token = sessionStorage.getItem('token');

const urlPrefix = 'https://auto-mart-adc.herokuapp.com';

window.onload = () => {
  // redirect to sign in page if the user is not logged in
  if (!is_loggedin) {
		window.location.href = './signin.html';
  }

  const userName = document.querySelector('.user-name');

  userName.innerHTML = `${sessionStorage.getItem('first_name')}
   ${sessionStorage.getItem('last_name').charAt(0)}.`;
};

// Helpers Functions
function previewImage(fieldId, previewB) {
	while (previewB.firstChild) previewB.removeChild(previewB.firstChild);
	const { files } = document.getElementById(fieldId);
	const total_file = files.length;
	for (let i = 0; i < total_file; i += 1) {
		const img = document.createElement('img');
		img.src = URL.createObjectURL(files[i]);
		previewB.appendChild(img);
	}
}

img_url.onchange = () => previewImage('upload-image', previewBox);

// Validation function
const validateForm = () => {
	const errorFields = [];
	if (manufacturer.value === '--') errorFields.push('manufacturer');
	if (model.value === '') errorFields.push('model');
	if (body_type.value === '--') errorFields.push('body_type');
	if (year.value === '--') errorFields.push('year');
	if (price.value === '') errorFields.push('price');
	if (state.value === '--') errorFields.push('state');
	if (color.value === '--') errorFields.push('color');
	if (mileage.value === '') errorFields.push('mileage');
	if (transmission_type.value === '--') errorFields.push('transmission');
	if (fuel_type.value === '--') errorFields.push('fuel_type');
	if (fuel_cap.value === '') errorFields.push('fuel_cap');
	if (doors.value === '') errorFields.push('doors');
	if (img_url.value === '') errorFields.push('img_url');
	if (description.value === '') errorFields.push('description');

	return errorFields;
};

// clear form fields after an upload
const clearFormFields = () => {
	manufacturer.value = null;
	model.value = null;
	body_type.value = null;
	year.value = null;
	price.value = null;
	state.value = null;
	color.value = null;
	mileage.value = null;
	transmission_type.value = null;
	fuel_type.value = null;
	fuel_cap.value = null;
	doors.value = null;
	img_url.value = null;
	description.value = null;
};

const handleErrors = (errors) => {
	let errMsg = '';
	errors.map((err) => {
		if (err === 'manufacturer') errMsg += 'manufacturer name cannot be empty<br/>';
		else if (err === 'model') errMsg += 'model name cannot be empty<br/>';
		else if (err === 'body_type') errMsg += 'body type cannot be empty<br/>';
		else if (err === 'year') errMsg += 'year cannot be empty<br/>';
		else if (err === 'price') errMsg += 'price cannot be empty<br/>';
		else if (err === 'state') errMsg += 'state cannot be empty<br/>';
		else if (err === 'color') errMsg += 'color cannot be empty<br/>';
		else if (err === 'mileage') errMsg += 'mileage cannot be empty<br/>';
		else if (err === 'transmission') errMsg += 'transmission type cannot be empty<br/>';
		else if (err === 'fuel_type') errMsg += 'fuel type cannot be empty<br/>';
		else if (err === 'fuel_cap') errMsg += 'fuel capacity cannot be empty<br/>';
		else if (err === 'doors') errMsg += 'number of doors cannot be empty<br/>';
		else if (err === 'img_url') errMsg += 'the image cannot be empty<br/>';
		else if (err === 'description') errMsg += 'description cannot be empty<br/>';
		errorDiv.classList.remove('hide');
		errorDiv.innerHTML = errMsg;
		return 0;
	});
};

postAdBtn.onclick = (e) => {
	e.preventDefault();
	errorDiv.classList.add('hide');
	errorDiv.style.backgroundColor = '#a45';

	const errors = validateForm();
	if (errors.length > 0) {
		handleErrors(errors);
	} else {
		// process the form
		postAdBtn.innerHTML = 'Processing data...';
		postAdBtn.disabled = 'disabled';
		const formData = new FormData(form);
		formData.set('ac', ac.checked.toString());
		formData.set('fm_radio', fm_radio.checked.toString());
		formData.set('arm_rest', arm_rest.checked.toString());
		formData.set('dvd_player', dvd_player.checked.toString());
		formData.set('tinted_windows', tinted_windows.checked.toString());
		formData.set('air_bag', air_bag.checked.toString());
		const options = {
			body: formData,
			method: 'POST',
			headers: { authorization: `Bearer ${token}` },
		};
		fetch(`${urlPrefix}/api/v1/car`, options)
		.then(res => res.json())
		.then((response) => {
			const res = response;
			if (res.status !== 201) {
				errorDiv.innerHTML = res.error;
			} else {
				errorDiv.style.backgroundColor = '#4b5';
				errorDiv.innerHTML = `
				You have successfully posted a new car ad.<br/>Name: ${res.data.name}<br/>
				Price: &#8358 ${parseInt(res.data.price, 10).toLocaleString('en-US')}<br/>
				Body type: ${res.data.body_type}<br>
				click <a href='./marketplace.html'>here to check it out on marketplace.</a>`;
			}
			errorDiv.classList.remove('hide');
			postAdBtn.innerHTML = 'Post New AD';
			postAdBtn.disabled = null;
			clearFormFields();
		})
		.catch((error) => {
			errorDiv.innerHTML = error;
		});
	}
};
