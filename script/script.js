let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

let dropDownMunicipality = document.getElementById("commune-select");

zipcodeInput.addEventListener("input", (e) => {
    if (regex.test(e.target.value)) {
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
