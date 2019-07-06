// Toggle Filter filter bar when the screen is below 800px
const filterContainer = document.getElementById('filter-container');
const filterDdBtn = document.getElementById('filter-dd-btn');

let filterContent = '';
const statusFilter = `
<div class="filter-attr">
  <h3>Car Status</h3>
  <div class="car-state-group">
    <label>
      <input type="radio" name="status" class="status common-seletor" checked>
      All
    </label>
    <label>
      <input type="radio" name="status" class="status common-seletor" value="Sold">
      Sold
    </label>
    <label>
      <input type="radio" name="status" class="status common-seletor" value="Available">
      Unsold
    </label>
  </div>
</div>`;
if (!window.location.href.includes('marketplace')) filterContent += statusFilter;

filterContent += `
<div class="filter-attr">
  <h3>Car State</h3>
  <div class="car-state-group">
    <label>
      <input type="radio" name="state" class="state common-seletor" checked>
      All
    </label>
    <label>
      <input type="radio" name="state" class="state common-seletor" value="New">
      New
    </label>
    <label>
      <input type="radio" name="state" class="state common-seletor" value="Used">
      Used
    </label>
  </div>
</div>
<div class="filter-attr">
  <h3>Price Range</h3>
  <div class="price-range">
    <input type="text" class="price min-price common-seletor" data-type="number" min="1000" placeholder="Min Price(&#8358)">
    <input type="text" class="price max-price common-seletor" data-type="number" min="1000" placeholder="Max Price(&#8358)">
  </div>
</div>
<div class="filter-attr">
  <h3>Manufacturer</h3>
  <div class="manufacturer-group">
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" checked>
      All
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Acura">
      Acura
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Audi">
      Audi
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Bentley">
      Bentley
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="BMW">
      BMW
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Bugatti">
      Bugatti
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Cadillac">
      Cadillac
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Chevrolet">
      Chevrolet
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Ferrari">
      Ferrari
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Ford">
      Ford
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="GMC">
      GMC
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Honda">
      Honda
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Hyundai">
      Hyundai
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Infiniti">
      Infiniti
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Jaguar">
      Jaguar
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Jeep">
      Jeep
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Kia">
      Kia
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Lamborghini">
      Lamborghini
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Land Rover">
      Land Rover
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Lexus">
      Lexus
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Mercedes-Benz">
      Mercedes-Benz
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Mitsubishi">
      Mitsubishi
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Nissan">
      Nissan
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Peugeot">
      Peugeot
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Porsche">
      Porsche
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Renault">
      Renault
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Rolls Royce">
      Rolls Royce
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Tesla">
      Tesla
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Toyota">
      Toyota
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Volkswagen">
      Volkswagen
    </label>
    <label>
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Volvo">
      Volvo
    </label>
  </div>
</div>
<div class="filter-attr">
  <h3>Body Type</h3>
  <div class="body-type-group">
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" checked>
      All
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Convertible">
      Convertible
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Coupe">
      Coupe
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Hatch">
      Hatch
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Large SUV">
      Large SUV
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Large Van">
      Large Van
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Micro">
      Micro
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="MPV">
      MPV
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Pick Up">
      Pick Up
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Small SUV">
      Small SUV
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Small Van">
      Small Van
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Sudan">
      Sudan
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Truck Cab">
      Truck Cab
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Truck Jeep">
      Truck Jeep
    </label>
  </div>
</div>`;

filterContainer.innerHTML = filterContent;

filterDdBtn.addEventListener('click', () => {
  const icons = document.querySelectorAll('#filter-dd-btn i');
  icons.forEach((icon) => {
    // function defined in general.js
    toggleClass(icon, 'hide');
  });
  filterContainer.style.display = filterContainer.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('resize', () => {
	if (window.innerWidth > 800) {
    filterContainer.style.display = 'block';
	} else {
    filterContainer.style.display = 'none';
    filterDdBtn.firstChild.classList.remove('hide');
    filterDdBtn.lastChild.classList.add('hide');
  }
});

/* ============= MANAGE FILTER LOGICS HERE ============= */
const filterSelectors = document.querySelectorAll('.common-seletor');
const variables = {
  min_price: null,
  max_price: null,
  manufacturer: null,
  body_type: null,
  state: null,
  status: null,
};

filterSelectors.forEach((selector) => {
  const sel = selector;
  sel.onchange = () => {
    let url = `${urlPrefix}/api/v1/car?`;

    if (sel.classList.contains('min-price')) {
      const val = sel.value.replace(/\D/g, '');
      variables.min_price = isNaN(parseFloat(val)) ? null : parseFloat(val);
    } else if (sel.classList.contains('max-price')) {
      const val = sel.value.replace(/\D/g, '');
      variables.max_price = isNaN(parseFloat(val)) ? null : parseFloat(val);
    } else if (sel.classList.contains('manufacturer')) {
      if (sel.checked) {
        variables.manufacturer = sel.value === 'on' ? null : sel.value;
      }
    } else if (sel.classList.contains('body-type')) {
      if (sel.checked) {
        variables.body_type = sel.value === 'on' ? null : sel.value;
      }
    } else if (sel.classList.contains('state')) {
      if (sel.checked) {
        variables.state = sel.value === 'on' ? null : sel.value;
      }
    } else if (sel.classList.contains('status')) {
      if (sel.checked) {
        variables.status = sel.value === 'on' ? null : sel.value;
      }
    }
    Object.keys(variables).forEach((key) => {
      if (variables[key] !== null) {
        url += `&${key}=${variables[key]}`;
      }
    });
    fetchCarAds(url, 'No car AD matches the filter parameter.');
  };
  return 0;
});
