var latitude = 3.0425383902202046;
var longitude = 100.40256180187565;

var map = L.map('map').setView([latitude, longitude], 8); // Inisialisasi peta dengan zoom out

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

var marker = L.marker([latitude, longitude]).addTo(map); // Tambahkan marker

var api_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height&timezone=Asia%2FBangkok`;

function determineWaveCategory(waveHeight) {
  if (waveHeight <= 0.5) {
    return { category: 'Aman', color: '#28a745' }; // Hijau untuk aman
  } else if (waveHeight <= 1.5) {
    return { category: 'Moderate', color: '#ffc107' }; // Kuning untuk moderate
  } else if (waveHeight <= 3) {
    return { category: 'Tinggi', color: '#fd7e14' }; // Oranye untuk tinggi
  } else {
    return { category: 'Berbahaya', color: '#dc3545' }; // Merah untuk berbahaya
  }
}

fetch(api_url)
  .then(response => response.json())
  .then(marineData => {
    const waveHeight = marineData.hourly.wave_height[0];
    const { category, color } = determineWaveCategory(waveHeight);

    document.getElementById('waveHeight').innerHTML = `<b>Latest Wave Height:</b> ${waveHeight} m (${category})`;
    document.getElementById('backgroundDiv').style.backgroundColor = color; // Ganti warna latar
    document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;

    populateForecastTable(marineData.hourly.time, marineData.hourly.wave_height);
  })
  .catch(error => {
    console.error('Error fetching marine data:', error);
  });

function updateData() {
  var coordinates = document.getElementById('coordinatesInput').value;

  // Split coordinates into latitude and longitude
  var [newLatitude, newLongitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()));

  if (isNaN(newLatitude) || isNaN(newLongitude)) {
    alert('Invalid coordinates. Please enter valid latitude and longitude separated by a comma.');
    return;
  }

  latitude = newLatitude;
  longitude = newLongitude;

  api_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height&timezone=Asia%2FBangkok`;

  fetch(api_url)
    .then(response => response.json())
    .then(marineData => {
      const waveHeight = marineData.hourly.wave_height[0];
      const { category, color } = determineWaveCategory(waveHeight);

      document.getElementById('waveHeight').innerHTML = `<b>Latest Wave Height:</b> ${waveHeight} m (${category})`;
      document.getElementById('backgroundDiv').style.backgroundColor = color; // Ganti warna latar
      document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;

      map.setView([latitude, longitude], 8); // Update peta
      marker.setLatLng([latitude, longitude]); // Pindahkan marker

      populateForecastTable(marineData.hourly.time, marineData.hourly.wave_height);
    })
    .catch(error => {
      console.error('Error fetching marine data:', error);
    });

  fetchLocationData();
}

function fetchLocationData() {
  var osm = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  fetch(osm)
    .then(response => response.json())
    .then(locationData => {
      const displayName = locationData.display_name || 'Location not found';
      document.getElementById('location').innerHTML = displayName;
    })
    .catch(error => {
      console.error('Error fetching location data:', error);
    });
}

function populateForecastTable(hourlyTime, waveHeights) {
  const tableBody = document.getElementById('forecastTableBody');
  tableBody.innerHTML = ''; // Clear table
  hourlyTime.forEach((time, index) => {
    const row = tableBody.insertRow();
    const timeCell = row.insertCell(0);
    const waveHeightCell = row.insertCell(1);

    timeCell.textContent = time;
    waveHeightCell.textContent = `${waveHeights[index]} m`;
  });
}

// Initial fetch for location data
fetchLocationData();
