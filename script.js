const button = document.getElementById('search-button');
        const input = document.getElementById('city');
        const cityName = document.getElementById('city-name');
        const cityTime = document.getElementById('city-time');
        const cityTemp = document.getElementById('city-temp');
        const feelsLike = document.getElementById('feels-like');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('wind-speed');
        const weatherIcon = document.getElementById('weather-icon');
        const weatherCondition = document.getElementById('weather-condition');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');


        function getWeatherIcon(condition) {
            condition = condition.toLowerCase();
            if (condition.includes('rain') || condition.includes('drizzle')) {
                return 'fa-cloud-rain';
            } else if (condition.includes('cloud')) {
                return 'fa-cloud';
            } else if (condition.includes('snow')) {
                return 'fa-snowflake';
            } else if (condition.includes('thunder')) {
                return 'fa-bolt';
            } else if (condition.includes('clear')) {
                return 'fa-sun';
            } else if (condition.includes('mist') || condition.includes('fog')) {
                return 'fa-smog';
            } else {
                return 'fa-cloud-sun';
            }
        }

        async function getData(cityname) {
            try {
                loading.classList.remove('hidden');
                const promise = await fetch(`https://api.weatherapi.com/v1/current.json?key=86e0a8b90729450ebf362400242410&q=${cityname}&aqi=yes`);
                const data = await promise.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                return data;
            } catch (err) {
                error.textContent = "Error fetching weather data. Please try again.";
                error.classList.remove('hidden');
                throw err;
            } finally {
                loading.classList.add('hidden');
            }
        }

        button.addEventListener('click', async () => {
            error.classList.add('hidden');
            const value = input.value.trim();
            if (!value) {
                error.textContent = "Please enter a city name";
                error.classList.remove('hidden');
                return;
            }

            try {
                const result = await getData(value);
                cityName.innerText = `${result.location.name}, ${result.location.country}`;
                cityTime.innerText = result.location.localtime;
                cityTemp.innerText = `${result.current.temp_c}°C`;
                feelsLike.innerText = `${result.current.feelslike_c}°C`;
                humidity.innerText = `${result.current.humidity}%`;
                windSpeed.innerText = `${result.current.wind_kph} km/h`;
    
                const condition = result.current.condition.text;
                weatherCondition.innerText = condition;
                weatherIcon.className = `weather-icon fas ${getWeatherIcon(condition)} mb-2`;
                
               
                if (condition.toLowerCase().includes('rain')) {
                    weatherIcon.classList.add('text-blue-400');
                } else if (condition.toLowerCase().includes('cloud')) {
                    weatherIcon.classList.add('text-gray-400');
                } else if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
                    weatherIcon.classList.add('text-yellow-400');
                }
            } catch (err) {
                console.error(err);
            }
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                button.click();
            }
        });