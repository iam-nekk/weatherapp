const APP_ID = "7cd9b56127ce102569d7c0c7ad66548b"

function onload(){
    getGPSLocation()
    onloadLoadPrevious()
}

function getGPSLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            console.log(position)
            getWeatherData([position.coords.latitude, position.coords.longitude])
        })
    }
    else {
        console.error("Geolocation not supported")
    }
}

function onloadLoadPrevious(){
    const weather = JSON.parse(localStorage.getItem("weather_request"))
    displayWeather(weather)
}

// find the city's location using the geocaching api
async function searchCity(){
    // get location
    const query = document.querySelector("input#cityname")

    if (query.value == '') return

    const cities = await request(`http://api.openweathermap.org/geo/1.0/direct?q=${query.value}&limit=5&appid=${APP_ID}`)

    populateSelector(cities)
}
// find the weather of the selected city
function findWeather(){
    const locationElement = document.querySelector("select#citynamedropdown")
    const location = locationElement.value.split(" ")
    console.log(location)

    getWeatherData(location)
}
// display it

async function getWeatherData(location){
    const weather = await request(`https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=${APP_ID}&units=metric`)
    localStorage.setItem("weather_request", JSON.stringify(weather))
    displayWeather(weather)
}

function displayWeather(weather){
    const weatherDiv = document.querySelector("div#infometeo")
    weatherDiv.innerHTML = `<h2>${weather.name}</h2>
    <p>${weather.weather[0].main} (${weather.weather[0].description})</p>
    <p>Temperature: ${weather.main.temp}°C</p>
    <p>Feels like: ${weather.main.feels_like}°C</p>
    <p>Wind speed: ${weather.wind.speed} m/s</p>
    <p>Sunrise: ${convertUnixTimestampToString(weather.sys.sunrise)}</p>
    <p>Sunset: ${convertUnixTimestampToString(weather.sys.sunset)}</p>`
}

function populateSelector(cities){
    console.log(cities)
    const citiesSelect = document.querySelector("select#citynamedropdown")
    citiesSelect.textContent = '' // clear previous children
    cities.forEach(city => {
        console.log(city)
        let optionText = document.createTextNode(`${city.name}, ${city.country}`)
        let option = document.createElement("option")
        option.append(optionText)
        option.value = `${city.lat} ${city.lon}`
        citiesSelect.appendChild(option)
    });
    
    document.getElementById("citynamedropdown").disabled = false
    document.getElementById("citynamebutton").disabled = false
}


async function request(url){
    let res = await axios.get(url)
    return res.data
}

function convertUnixTimestampToString(unix_timestamp){

    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    let date = new Date(unix_timestamp * 1000);

    // Hours part from the timestamp
    let hours = date.getHours();

    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();

    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime
}