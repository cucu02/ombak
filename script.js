var latitude = 3.0425383902202046;
var longitude = 100.40256180187565;

var api_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height&timezone=Asia%2FBangkok`;

fetch(api_url)
  .then(response => response.json())
  .then(marineData => {
    const hourlyTime = marineData.hourly.time;
    const waveHeights = marineData.hourly.wave_height;
    const latitude = marineData.latitude;
    const longitude = marineData.longitude;

    document.getElementById('waveHeight').innerHTML = `<b>Latest Wave Height:</b> ${waveHeights[0]} m`;
    document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;

    populateForecastTable(hourlyTime, waveHeights);
  })
  .catch(error => {
    console.error('Error fetching marine data:', error);
  });

function updateData() {
  var newLatitude = document.getElementById('latitudeInput').value;
  var newLongitude = document.getElementById('longitudeInput').value;

  latitude = parseFloat(newLatitude);
  longitude = parseFloat(newLongitude);

  api_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height&timezone=Asia%2FBangkok`;

  fetch(api_url)
    .then(response => response.json())
    .then(marineData => {
      const hourlyTime = marineData.hourly.time;
      const waveHeights = marineData.hourly.wave_height;
      const latitude = marineData.latitude;
      const longitude = marineData.longitude;

      document.getElementById('waveHeight').innerHTML = `<b>Latest Wave Height:</b> ${waveHeights[0]} m`;
      document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;
      populateForecastTable(hourlyTime, waveHeights);
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
