let numberDay = 1;
let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

let dropDownMunicipality = document.getElementById("commune-select");

let weather_card = document.getElementById("section-weather");

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
const WEATHER_RESPONSE = document.getElementById("section-weather");
let apiWeather = null;

[].forEach.call(document.getElementsByClassName("CheckButton"), function (el) {
    el.addEventListener("change", function () {
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
        let imgSrc = "";
        let imgAlt = "";
        weather_card.className = "section-card";

        let theDate = new Date(Date.parse(apiWeather["forecast"][day]["datetime"]));

        DIV_WEATHER.innerHTML = `<div id="city-div"><p>Météo pour ${apiWeather["city"]["name"]}</p></div>
        <p>${theDate.toLocaleString("fr-FR", { weekday: 'long', day: "numeric", month: "long" })}</p>`;

        if (weather == 0) {
            weatherText = "Ensoleillé";
            imgSrc = "./Images/sun_weather_icon.png";
            imgAlt = "Ensolleillé";
        } else if (weather == 1) {
            weatherText = "Un peu nuageux";
            imgSrc = "./Images/bit_cloudy_weather_icon.png";
            imgAlt = "un peu nuageux";
        } else if (weather < 10) {
            weatherText = "Nuageux";
            imgSrc = "./Images/cloudy_weather_icon.png";
            imgAlt = "Nuageux";
        } else if (weather >= 100 && weather < 200) {
            weatherText = "Orageux";
            imgSrc = "./Images/stormy_weather_icon.png";
            imgAlt = "Orageux";
        } else {
            weatherText = "Pluvieux";
            imgSrc = "./Images/rainy_weather_icon.png";
            imgAlt = "Pluvieux";
        }


        DIV_WEATHER.innerHTML += `<div id="weather-info">
        <div id="card-div"><img id="image-weather" src= "${imgSrc}" alt= "${imgAlt}"/><p>${weatherText}</p></div>
        <div id="global-info"><p>min : ${apiWeather["forecast"][day]["tmin"]}°C</p><p>max : ${apiWeather["forecast"][day]["tmax"]}°C</p>
        <p>Probabilité de pluie: ${apiWeather["forecast"][day]["probarain"]} %</p><p>Heures d'ensoleillement: ${apiWeather["forecast"][day]["sun_hours"]}h</p></div>
        </div>`;


        let moreInfo = ""

        if (hasLatitude && hasLongitude) {
            moreInfo += `<div id="latLong"><p>Latitude: ${apiWeather["city"]["latitude"]}°</p><p>Longitude: ${apiWeather["city"]["longitude"]}°</p></div>`
        } else {
            if (hasLatitude) {
                moreInfo += `<div id="latLong"><p>Latitude: ${apiWeather["city"]["latitude"]}°</p></div>`
            }
            if (hasLongitude) {
                moreInfo += `<div id="latLong"><p>Longitude: ${apiWeather["city"]["longitude"]}°</p></div>`
            }
        }
        if (hasRain) {
            moreInfo += `<p>Cumul de pluie : ${apiWeather["forecast"][day]["rr10"]}mm  </p>`
        }
        if (hasWindSpeed && hasWindDir) {
            moreInfo += `<div id="wind"><p>Vitesse moyenne du vent : ${apiWeather["forecast"][day]["wind10m"]}km/h</p><p>Direction du vent: ${winddir}° (${dirtext})</p></div>`
        }
        else {
            if (hasWindSpeed) {
                moreInfo += `<div id="wind"><p>Vitesse moyenne du vent : ${apiWeather["forecast"][day]["wind10m"]}km/h</p>`
            }
            if (hasWindDir) {
                moreInfo += `<div id="wind"><p>Direction du vent: ${winddir}° (${dirtext})</p></div>`
            }
        }

        DIV_WEATHER.innerHTML += `<div id ="moreInfo">${moreInfo}</div>`

        WEATHER_RESPONSE.appendChild(DIV_WEATHER);
    }
}

document.getElementById("sendForm").addEventListener("click", (e) => {
    let codeInsee = dropDownMunicipality.options[dropDownMunicipality.selectedIndex].value.toString();
    let req = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`;
    DAY_RANGE.value = numberDay;

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

DAY_RANGE.addEventListener("input", function () {
    const dayRegEx = new RegExp('^[1-7]?$', 'gm');
    if (!dayRegEx.test(DAY_RANGE.value)) {
        DAY_RANGE.value = numberDay;
    } else {
        numberDay = DAY_RANGE.value;
        if (numberDay == "") {
            numberDay = 1;
        }
    }
    console.log(numberDay);
});