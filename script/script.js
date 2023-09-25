let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode = "50000";

function addSelectElement(element){
    console.log(element[0].code);
}

fetch(urlAPI+zipcode)
.then(response =>{
    if(!response.ok){
        throw new Error('Network response is not ok');
    }

    return response.json();
})
.then(data => {
    addSelectElement(data);
})
.catch(error => {
    ('There was a problem while accessong the data',error);
});

