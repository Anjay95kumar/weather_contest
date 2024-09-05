document.getElementById('fetchDataBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById('latitude').innerText = lat;
    document.getElementById('longitude').innerText = lon;
    document.getElementById('locationInfo').classList.remove('hidden');

    initMap(lat, lon);
    await fetchWeatherData(lat, lon);
}

function showError(error) {
    const errorContainer = document.getElementById('errorContainer') || document.createElement('p');
    errorContainer.id = 'errorContainer';
    errorContainer.style.color = 'red';
    errorContainer.style.fontWeight = 'bold';
    document.body.appendChild(errorContainer);

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorContainer.innerText = "User denied the request for Geolocation. Please allow access to location to use this feature.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorContainer.innerText = "Location information is unavailable. Please check your network connection.";
            break;
        case error.TIMEOUT:
            errorContainer.innerText = "The request to get your location timed out. Please try again.";
            break;
        case error.UNKNOWN_ERROR:
            errorContainer.innerText = "An unknown error occurred while fetching your location.";
            break;
    }
}

function initMap(lat, lon) {
    document.getElementById('map').classList.remove('hidden');
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng: lon },
        zoom: 8,
    });

    new google.maps.Marker({
        position: { lat, lng: lon },
        map: map,
    });
}

async function fetchWeatherData(lat, lon) {
    const apiKey = 'a70993c816dbb5008d66bd73f4d28874'; // Ensure this key is correct
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data) {
            document.getElementById('locationName').innerText = data.name; // City name
            document.getElementById('windSpeed').innerText = data.wind.speed || 'N/A'; // Wind speed
            document.getElementById('humidity').innerText = data.main.humidity || 'N/A'; // Humidity
            document.getElementById('temperature').innerText = data.main.temp || 'N/A'; // Temperature
            document.getElementById('pressure').innerText = data.main.pressure || 'N/A'; // Pressure
            document.getElementById('weatherData').classList.remove('hidden');
        } else {
            throw new Error('Incomplete data received from the weather API.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherData').classList.add('hidden');
    }
}

window.addEventListener('error', function(event) {
    if (event.target.tagName === 'SCRIPT' && event.target.src.includes('maps.googleapis.com')) {
        document.getElementById('mapError').classList.remove('hidden');
        document.getElementById('map').classList.add('hidden');
    }
});
