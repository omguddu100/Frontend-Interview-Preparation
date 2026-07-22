'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry= function(data, neighbour=''){
debugger
    const html = `
    <article class="country ${neighbour}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} Peopel</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].nativeName}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
    </div>
  </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity=1

}

const GetCountryData = function (Country_code){
const reruest =new  XMLHttpRequest();
reruest.open('GET',`https://restcountries.eu/rest/v2/alpha?codes=${Country_code}`);
reruest.send();

reruest.addEventListener('load',function(){
    const [data]= JSON.parse(this.responseText)
    renderCountry(data)
    //2nd AJAX call
    data.borders.forEach(element => {
        const reruest2 =new  XMLHttpRequest();
        reruest2.open('GET',`https://restcountries.eu/rest/v2/alpha?codes=${element}`);
        reruest2.send();
        reruest2.addEventListener('load', function(){
            const [data2]=JSON.parse(this.responseText)
            renderCountry(data2, 'neighbour')
         }) 
    });
})
}
GetCountryData('USA')
