let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

zipcodeInput.addEventListener("input", (e) =>{
    if(regex.test(e.target.value)){
        zipcode=e.target.value;
        apiMunicipality();
    }
})


function addSelectElement(element){
    console.log(element);
}

function testPostalCode(element){
    return (element.length!=0);
}

function apiMunicipality(){
    fetch(urlAPI+zipcode)
    .then(response =>{
        if(!response.ok){
            throw new Error('Network response is not ok');
        }

        return response.json();
    })
    .then(data => {
        if(testPostalCode(data)){
            addSelectElement(data);
        }
    })
    .catch(error => {
        ('There was a problem while accessong the data',error);
    });
}
