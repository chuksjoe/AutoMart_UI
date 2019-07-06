// used to get details of a car from the database
const previewCar = (carId, btnGrp) => {
  const carPreviewModal = document.querySelector('#car-preview-overlay .modal-body');
  const carDetails = document.querySelector('#car-preview-overlay .car-view-detail');
  const mainDesc = document.querySelector('#car-preview-overlay .car-view-main-desc');
  const otherInfo = document.querySelector('#car-preview-overlay .other-info');

  carPreviewModal.innerHTML = '<div id="loading"><img src="../images/loader.gif" /></div>';
  fetch(`${urlPrefix}/api/v1/car/${carId}`)
  .then(res => res.json())
  .then((response) => {
    if (response.status === 200) {
      const car = response.data;
      const {
        name, img_url, manufacturer, model, year, state, owner_id, owner_name, price,
        body_type, fuel_type, mileage, color, transmission_type, fuel_cap, created_on, doors,
        description, ac, arm_rest, air_bag, dvd_player, fm_radio, tinted_windows,
      } = car;
      document.querySelector('#car-preview-overlay .modal-header').innerHTML = name;
      document.querySelector('#car-preview-overlay .added-date').innerHTML = `Added on: ${configDate(created_on)}`;

      carDetails.innerHTML = `<div class="car-view-image"><img src="${img_url}" alt="${name}"></div>`;
      mainDesc.innerHTML = `
      <p class="c-price">Price: &#8358 ${parseInt(price, 10).toLocaleString('en-US')}</p>
      <div class="prop-list flex-container">
        <p class="prop"><b>Make:</b><br>${manufacturer}</p>
        <p class="prop"><b>Model:</b><br>${model}</p>
        <p class="prop"><b>State:</b><br>${state}</p>
        <p class="prop"><b>Body Type:</b><br>${body_type}</p>
        <p class="prop"><b>Color:</b><br>${color}</p>
        <p class="prop"><b>Year:</b><br>${year}</p>
        <p class="prop"><b>Fuel Type:</b><br>${fuel_type}</p>
        <p class="prop"><b>Fuel Capacity:</b><br>${fuel_cap}Liter</p>
        <p class="prop"><b>Mileage:</b><br>${mileage.toLocaleString('en-US')}mpg</p>
        <p class="prop"><b>Transmission:</b><br>${transmission_type}</p>
        <p class="prop"><b>Doors:</b><br>${doors} doors</p>
        <p class="prop"><b>Posted By:</b><br>${(owner_id === parseInt(user_id, 10) ? 'Me' : owner_name)}</p>
      </div>`;
      otherInfo.innerHTML = `
      <div class="description">
        <h3>Description</h3><hr>
        <p>${description}</p>
      </div>
      <div class="features">
        <h3>Features</h3><hr>
        <p>${ac ? '<label>Air Condition</label>' : ''}${arm_rest ? '<label>Arm Rest</label>' : ''}
        ${air_bag ? '<label>Air Bag</label>' : ''}${dvd_player ? '<label>DVD Player</label>' : ''}
        ${fm_radio ? '<label>FM Radio</label>' : ''}${tinted_windows ? '<label>Tinted Glasses</label>' : ''}</p>
      </div>`;

      mainDesc.appendChild(btnGrp);
      carDetails.appendChild(mainDesc);
      carDetails.appendChild(otherInfo);
      carPreviewModal.innerHTML = null;
      carPreviewModal.appendChild(carDetails);
    } else {
      message.innerHTML = response.error;
      notificationModal.style.display = 'block';
      toggleScroll();
    }
  })
  .catch((err) => {
    carPreviewModal.innerHTML = `<br/><br/>${errorMessage(err)}`;
  });
};
