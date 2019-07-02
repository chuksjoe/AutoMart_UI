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
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Land-Rover">
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
      <input type="radio" name="manufacturer" class="manufacturer common-seletor" value="Rolls-Royce">
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
      <input type="radio" name="body-type" class="body-type common-seletor" value="Micro">
      Micro
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Convertible">
      Convertible
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Large Van">
      Large Van
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Large SUV">
      Large SUV
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Small Van">
      Small Van
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Coupe">
      Coupe
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Sudan">
      Sudan
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Truck">
      Truck
    </label>
    <label>
      <input type="radio" name="body-type" class="body-type common-seletor" value="Truck Cab">
      Truck Cab
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
      <input type="radio" name="body-type" class="body-type common-seletor" value="Hatch">
      Hatch
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
