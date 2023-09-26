let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

let dropDownMunicipality = document.getElementById("commune-select");

zipcodeInput.addEventListener("input", (e) => {
    if (regex.test(e.target.value) && parseInt(e.target.value) < 96000) {
        dropDownMunicipality.hidden = false;
        document.getElementById("commune-label").hidden = false;
        document.getElementById("sendForm").hidden = false;
        zipcode = e.target.value;
        apiMunicipality();
    } else {
        dropDownMunicipality.hidden = true;
        document.getElementById("commune-label").hidden = true;
        document.getElementById("sendForm").hidden = true;
    }
})


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

const token = "e9573bea167f06b5ca0805e4ef64e697562f702d022c084058058f958b11d272"

document.getElementById("sendForm").addEventListener("click", (e) => {
    let codeInsee = dropDownMunicipality.options[dropDownMunicipality.selectedIndex].value.toString();
    let req = `https://api.meteo-concept.com/api/forecast/daily/0?token=${token}&insee=${codeInsee}`;

    fetch(req)
        .then(response => {
            if (!response.ok) {
                throw new Error('not working');
            }
            return response.json();
        })
        .then(apiWeather => {
            let winddir =  apiWeather["forecast"]["dirwind10m"];
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

            let weather = apiWeather["forecast"]["weather"];
            let weatherText = "";

            if (weather == 0) {
                weatherText = "Sunny";
            } else if (weather == 1) {
                weatherText = "A bit cloudy";
            } else if (weather < 10) {
                weatherText = "Cloudy";
            } else if (weather >= 100 && weather < 200) {
                weatherText = "Stormy";
            } else {
                weatherText = "Rainy";
            }

            
            document.getElementById("weatherResponse").innerHTML = 
                `Weather for ${apiWeather["city"]["name"]} (${apiWeather["city"]["latitude"]}°, ${apiWeather["city"]["longitude"]}°): <br>
                    Min temperature: ${apiWeather["forecast"]["tmin"]}°C <br>
                    Max temperature: ${apiWeather["forecast"]["tmax"]}°C <br>
                    Rain probability: ${apiWeather["forecast"]["probarain"]} % <br>
                    Accumulation of rain: ${apiWeather["forecast"]["rr10"]}mm <br>
                    Hours of sunlight: ${apiWeather["forecast"]["sun_hours"]}h <br>
                    Average wind speed: ${apiWeather["forecast"]["wind10m"]}km/h <br>
                    Wind direction: ${winddir}° (${dirtext}) <br><br>
                    ${weatherText}`
        })
        .catch(error => {
            document.getElementById("weatherResponse").innerHTML = "Not working";
        });
});