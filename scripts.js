document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;

    // Geocoding to get latitude and longitude of the city
    fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;

                // Fetching weather data from Open-Meteo API
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

                return fetch(apiUrl);
            } else {
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            const weatherDisplay = document.getElementById('weatherDisplay');
            if (data && data.current_weather) {
                const temperature = data.current_weather.temperature;
                let weatherStatus;

                // Interpret temperature
                if (temperature < 10) {
                    weatherStatus = 'Cold';
                } else if (temperature >= 10 && temperature <= 25) {
                    weatherStatus = 'Normal';
                } else {
                    weatherStatus = 'Hot';
                }

                weatherDisplay.innerHTML = `
                    <h2>Weather in ${city}</h2>
                    <p>Temperature: ${temperature}°C - ${weatherStatus}</p>
                    <p>Wind Speed: ${data.current_weather.windspeed} km/h</p>
                `;
            } else {
                weatherDisplay.innerHTML = `<p>Weather data not available</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            document.getElementById('weatherDisplay').innerHTML = `<p>Error fetching the weather data. Please try again later.</p>`;
        });
});
