let numberDay = 1;
let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

let dropDownMunicipality = document.getElementById("commune-select");

//Listener on the input for the zip-code
zipcodeInput.addEventListener("input", (e) => {
    if (regex.test(e.target.value) && parseInt(e.target.value) < 96000) {
        zipcode = e.target.value;
        apiMunicipality();
    } else {
        ShowOrHideMunicipality(true);
    }
})

function ShowOrHideMunicipality(show) {
    dropDownMunicipality.hidden = show;
    document.getElementById("commune-label").hidden = show;
    document.getElementById("sendForm").hidden = show;
}

// Add all the municipality with the same zip-code
function addSelectElement(element) {
    dropDownMunicipality.innerHTML = ''
    for (i = 0; i < element.length; i++) {
        const op = document.createElement('option');
        op.value = element[i].code;
        op.textContent = element[i].nom;
        dropDownMunicipality.appendChild(op);
    }
}


function testPostalCode(element) {
    return (element.length != 0);
}

// Handle geo-api 
function apiMunicipality() {
    fetch(urlAPI + zipcode)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response is not ok');
            }

            return response.json();
        })
        .then(data => {
            if (testPostalCode(data)) {
                ShowOrHideMunicipality(false);
                addSelectElement(data);
            } else {
                dropDownMunicipality.hidden = true;
                document.getElementById("commune-label").hidden = true;
                document.getElementById("sendForm").hidden = true;
            }
        })
        .catch(error => {
            ('There was a problem while accessong the data', error);
        });
}


// Implementation of fixed code weather request

const CHECKBOX_LATITUDE = document.getElementById('latitude');
const CHECKBOX_LONGITUDE = document.getElementById('longitude');
const CHECKBOX_RAIN = document.getElementById('AccRain');
const CHECKBOX_WINDSPEED = document.getElementById('AvgWind');
const CHECKBOX_WINDDIR = document.getElementById('windDir');
const WEATHER_RESPONSE = document.getElementById("weatherResponse");
let apiWeather = null;

[].forEach.call(document.getElementsByClassName("CheckButton"), function(el) {
    el.addEventListener("change", function() {
        if (apiWeather != null) {
            displayWeather(apiWeather, numberDay);
        }
    });
});

const token = "e9573bea167f06b5ca0805e4ef64e697562f702d022c084058058f958b11d272"

function displayWeather(apiWeather, count) {
    WEATHER_RESPONSE.innerHTML = "";
    for (let day = 0; day < count; day++) {
        const DIV_WEATHER = document.createElement("div");
        DIV_WEATHER.classList.add("weatherDay");
        let hasLatitude = CHECKBOX_LATITUDE.checked;
        let hasLongitude = CHECKBOX_LONGITUDE.checked;
        let hasRain = CHECKBOX_RAIN.checked;
        let hasWindSpeed = CHECKBOX_WINDSPEED.checked;
        let hasWindDir = CHECKBOX_WINDDIR.checked;

        let winddir = apiWeather["forecast"][day]["dirwind10m"];
        let dirtext = "";
        if (337 < winddir || winddir < 23) {
            dirtext = "Nord";
        } else if (winddir < 68) {
            dirtext = "Nord-Est";
        } else if (winddir < 113) {
            dirtext = "Est";
        } else if (winddir < 158) {
            dirtext = "Sud-Est";
        } else if (winddir < 203) {
            dirtext = "Sud";
        } else if (winddir < 248) {
            dirtext = "Sud-Ouest";
        } else if (winddir < 293) {
            dirtext = "Ouest";
        } else {
            dirtext = "Nord-Ouest";
        }
        let weather = apiWeather["forecast"][day]["weather"];
        let weatherText = "";

        if (weather == 0) {
            weatherText = "Ensoleillé";
            document.getElementById("image-weather").src="./Images/sun_weather_icon.png";
        } else if (weather == 1) {
            weatherText = "Un peu nuageux";
            document.getElementById("image-weather").src="./Images/bit_cloudy_weather_icon.png";
        } else if (weather < 10) {
            weatherText = "Nuageux";
            document.getElementById("image-weather").src="./Images/cloudy_weather_icon.png";
        } else if (weather >= 100 && weather < 200) {
            weatherText = "Orageux";
            document.getElementById("image-weather").src="./Images/stormy_weather_icon.png";
        } else {
            weatherText = "Pluvieux";
            document.getElementById("image-weather").src="./Images/rainy_weather_icon.png";
        }

        let theDate = new Date(Date.parse(apiWeather["forecast"][day]["datetime"]));

        DIV_WEATHER.innerHTML = `<p>${theDate.toLocaleString("fr-FR", {weekday: 'long', day:"numeric", month:"long"})}</p>`;
        DIV_WEATHER.innerHTML += `<p>Météo pour ${apiWeather["city"]["name"]}: </p>`;
        
        DIV_WEATHER.innerHTML += `<p>${weatherText}</p>`
        DIV_WEATHER.innerHTML += `<p>Temperature min: ${apiWeather["forecast"][day]["tmin"]}°C </p>`
        DIV_WEATHER.innerHTML += `<p>Temperature max: ${apiWeather["forecast"][day]["tmax"]}°C  </p>`
        DIV_WEATHER.innerHTML += `<p>Probabilité de pluie: ${apiWeather["forecast"][day]["probarain"]} %  </p>`
        DIV_WEATHER.innerHTML += `<p>Heures d'ensoleillement: ${apiWeather["forecast"][day]["sun_hours"]}h  </p>`
        if (hasLatitude) {
            DIV_WEATHER.innerHTML += `<p>Latitude: ${apiWeather["city"]["latitude"]}° </p>`
        }
        if (hasLongitude) {
            DIV_WEATHER.innerHTML += `<p>Longitude: ${apiWeather["city"]["longitude"]} </p>`
        }
        if (hasRain) {
            DIV_WEATHER.innerHTML += `<p>Cumul de pluie : ${apiWeather["forecast"][day]["rr10"]}mm  </p>`
        }
        if (hasWindSpeed) {
            DIV_WEATHER.innerHTML += `<p>Vitesse moyenne du vent : ${apiWeather["forecast"][day]["wind10m"]}km/h  </p>`
        }
        if (hasWindDir) {
            DIV_WEATHER.innerHTML += `<p>Direction du vent: ${winddir}° (${dirtext})  </p>`
        }
        WEATHER_RESPONSE.appendChild(DIV_WEATHER);
    }
}

document.getElementById("sendForm").addEventListener("click", (e) => {
    let codeInsee = dropDownMunicipality.options[dropDownMunicipality.selectedIndex].value.toString();
    let req = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`;

    fetch(req)
        .then(response => {
            if (!response.ok) {
                throw new Error('not working');
            }
            return response.json();
        })
        .then(response => {
            apiWeather = response;
            displayWeather(apiWeather, numberDay);
        })
        .catch(error => {
            document.getElementById("weatherResponse").innerHTML = "Not working";
        });
});

const DAY_RANGE = document.getElementById("dayRange");

DAY_RANGE.addEventListener("input", function() {
    const dayRegEx = new RegExp('^[1-7]$', 'gm');
    if (!dayRegEx.test(DAY_RANGE.value)) {
        DAY_RANGE.value = numberDay;
    } else {
        numberDay = DAY_RANGE.value;
    }
});