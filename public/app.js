const axios = require('axios');
let currencyForm = document.querySelector('#currencyForm');
let fromCountry = document.querySelector('#from');
let toCountry = document.querySelector('#to');
let input = document.querySelector('input[type="text"]');
let currencyResult = document.querySelector('#currency-result');
let showCountryResult = document.querySelector('#result');
let ui, api, currency_controller; 


class UI{


     displayError(message, classError){
          let messageWrapper = document.querySelector('#error');
          messageWrapper.appendChild(document.createTextNode(message));
          messageWrapper.style.color = '#fff';
          messageWrapper.style.backgroundColor = 'red';
          messageWrapper.style.textAlign = 'center';
          messageWrapper.style.fontSize = '18px';
          messageWrapper.style.marginBottom = '10px';

          setTimeout(function(){
               messageWrapper.remove();
               currencyForm.reset();     
               window.location.reload();
               
          }, 3000);
          
     }

     updateCalculation(result){
      currencyResult.style.backgroundColor = 'green';
      currencyResult.style.color = 'white';
      currencyResult.style.fontSize = '15px';
      currencyResult.style.textAlign = 'center';
      currencyResult.appendChild(document.createTextNode(result));

          setTimeout(function(){
               currencyResult.remove();
               window.location.reload();
          },20000);

     }

     showCountries(allCountries){
          let html = '';
          html += '<ul class="list">';

          allCountries.forEach(function(country){
               html += `
                         <li>${country}</li>
               `;
          });

          html += '</ul>';

          // html+= '<ul class="list">';
          // allCountries.forEach(function(country){
          //      html += `

                    
          //           <li>${country}</li>
                    
          //      `;
          // });
          // html+= '</ul>';

          showCountryResult.innerHTML = html;
          
     }
}


class currencyAPI{

     //GET COUNTRIES
    async getCountries (toCurrency) {

     try{
       const response = await axios.get(`http://restcountries.eu/rest/v2/currency/${toCurrency}`);
       return response.data.map(country => country.name);
     } catch(error){
         throw new Error (`Unable to get Countries that use ${toCurrency}`);
     }
     //const array =  response.data.map(country => country.name);
     //console.log(array);
   }

   //get exchange rate
    async getExchangeRate (fromCurrency, toCurrency) {

     const response = await axios.get('http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1');
     
     const rate = response.data.rates;
     const euro = 1/rate[fromCurrency];
     const exchangeRate = euro * rate[toCurrency];
 
     if(isNaN(exchangeRate)){
         throw new Error (`unable to get currency ${fromCurrency} and ${toCurrency}`);
     }
 
     //console.log(exchangeRate);   //1 american dollars = euros
     return exchangeRate;
   }

}


//currency controller 
class currencyController{

     
     async convertCurrency (fromCurrency, toCurrency, amount) {
     api = new currencyAPI();     
     const countries = await api.getCountries(toCurrency);
     const exchangeRate = await api.getExchangeRate(fromCurrency, toCurrency);
     const convertedAmount = (amount * exchangeRate).toFixed(2);
     const result = `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.`;
     ui.showCountries(countries);
     ui.updateCalculation(result);
     return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. you can spend this in the following countries:${countries}`
 }

}

ui = new UI();
currency_controller = new currencyController();

runEvents();

//RUN ALL EVENTS 
function runEvents(){
     currencyForm.addEventListener('submit', convertCurrency);
}

//call back functions 
function convertCurrency(e){
     e.preventDefault();
     if(fromCountry.value == '' || toCountry.value == '' || input.value == ''){
          ui.displayError("One or More of fields are empty" , 'alert-danger');
     }else{
          var result = currency_controller.convertCurrency(fromCountry.value, toCountry.value, input.value)
          .then(message => console.log(message))
          .catch(error => console.log(error));
               
     }
}
