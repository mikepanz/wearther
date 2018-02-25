$(document).ready(function() {
	//getting the elements from document
    var weatherText = document.getElementById('weather-text')
    var temp = document.getElementById('js-temp');
    var city = document.getElementById('js-city');
    var desc = document.getElementById('js-desc');
    var actionBtn = document.getElementById('js-btn');
    var unit = document.getElementById('js-unit');
    var zip = document.getElementById('js-zip');
    var zipP = document.getElementById('js-zip-p');
    var requestURL = '';
    var uC = "°C";
    var uF = "°F";
  //add event listener to the generate outfit button
    actionBtn.addEventListener('click', getWeather);
  //get the location once the page is loaded
   
//  window.onload = getLocation();
    var checkbox = document.getElementById('switch');
    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        getLocation();
        zip.classList.add('hide');
        zipP.classList.add('hide');
      }
      else {
          zip.classList.remove('hide');
      }
    });
  //function for getting geolacation data from browser
    function getLocation(){
      //use browser to get current location referenced from (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
        navigator.geolocation.getCurrentPosition(success, error);
      //if broswer does't support geolocation, then alert the user and reveal zip code input
        if (!navigator.geolocation){
            alert("Geolocation is not supported by your browser. Please use zip code.");
            zip.classList.remove('hide');
            zipP.classList.remove('hide');
            checkbox.checked = false;
        }
      // upon success of getting location, use latitude and longitude to complete URL string for API call
        function success(position) {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            var lat = latitude.toFixed(2);
            var lon = longitude.toFixed(2);
          //logging the lat and lon data
            console.log("lat: " + lat + " & lon: " + lon);
          //store the complete URL string using lat and lon data
            requestURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat +"&lon=" + lon + '&APPID=e06c6f72250a393baccfa4415b355158&units=metric';
          //logging the complete URL string
            console.log(requestURL);
        }
      //upon failure of getting location, alert the user and reveal zip code input
        function error() {
            alert("Unable to retrieve your location. Please use zip code.");
            zip.classList.remove('hide');
            zipP.classList.remove('hide');
            checkbox.checked = false;
            console.log(checkbox.checked);
        }
      }
  //function for getting the weather data from openweathermap.org
    function getWeather(reqURL){
      //logging that the getWeather function is running
        console.log('running getWeather');
      //setting the URL for the API call using zip code
        var reqURL = '';
      //if the zip input is hiding, which means successfully getting the geolocation, set the calling API as the URL created before
        if (zip.classList.contains('hide')) {
            reqURL = requestURL;
        }
      //else, which means the geolocation data is not retrieved, set the calling API using the zip code from the input
        else {

            var zipCode = document.getElementById('js-zip').value;
            if (zipCode*0 == 0) {
            reqURL = 'https://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + '&APPID=e06c6f72250a393baccfa4415b355158&units=metric';
            }
            else {
            reqURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + zipCode + '&APPID=e06c6f72250a393baccfa4415b355158&units=metric';
            }
        }
      //new XML http request referenced from (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
        var request = new XMLHttpRequest();
      //logging that the request is running
        console.log('getting request');
      //request using the URL that is set either by lat and lon data or zip code
        request.open('GET', reqURL);
        request.responseType = 'json';
      //logging the actual calling URL
        console.log(reqURL);
      //send the request
        request.send();
      //once the request is loaded and have a response, show the weather using the response
        request.onload = function() {
          //store the response in a variable which will later be used to show weather
            var openWeather = request.response;
          //logging that everything before showWeather is complete
            console.log('before showWeather');
          //calling the showWeather function using the response 
            showWeather(openWeather);
        }
    }
  //function for showing the weather
    function showWeather(jsonObj) {
      //logging that the showWeather function is running
        console.log('running showWeather');
      //if the response 404'ed, alert the user to change the zip code entered and break from the function
        if(jsonObj.cod == "404" || jsonObj.cod == "400") {
            alert("Sorry, we cannot recognize the zip code or city you just entered. Please make sure it's valid.");
            return;
        }
      //hide the inputs and reveal the outputs
        document.getElementById("container").classList.add('hide');
        document.getElementById("again").classList.remove('hide');
        document.getElementById("wc").classList.remove('hide');
      //show the empty div for images
        document.getElementById('empty').classList.remove("hide");
      //storing the specific data we need from the json object and put it in HTML document
        var tempIcon = jsonObj['weather'][0].icon;
        var tempDesc = jsonObj['weather'][0].description;
        var tempCity = jsonObj.name;
        var tempRounded = Math.round(jsonObj['main'].temp);
        city.textContent = tempCity;
        desc.textContent = tempDesc;
      //set the icon img's src & alt using the icon code from the json object
        var icon = document.getElementById('js-icon');
        icon.src = "https://openweathermap.org/img/w/" + tempIcon + ".png"
        icon.alt = tempDesc;
      //see if Celsius or Fahrenheit is checked
        var cChecked = document.getElementById("js-c").checked;
        console.log(cChecked);
        var fChecked = document.getElementById("js-f").checked;
        console.log(fChecked);
      //calculating the Fahrenheit using the Celsius weather data
        var tempRoundedF = Math.round(tempRounded * 9 / 5 + 32);
      //if Celsius is checked, display the Celsius temperature and unit symbol, else display Fahrenheit temperature and symbol
        if (cChecked == true) {
            console.log('curernt unit is C');
            temp.textContent = tempRounded;
            unit.textContent = uC;
        }
        else {
            console.log('current unit is F');
            temp.textContent = tempRoundedF;
            unit.textContent = uF;
        }
      //determine if it is raining based on the icon
        var iconRain = ["09","10","11","13"];
        var rainOrNot = false;
        for (var i = iconRain.length - 1; i >= 0; i--) {
          if (tempIcon.includes(iconRain[i])) {
            rainOrNot = true;
          }
        }
      //call the print result function using the Celsius temperature data and rainOrNot
        printResult(tempRounded, rainOrNot);
    }
  //function for printing the result of the outfit
    function printResult(tempRounded, rainOrNot) {
      //see if the boy and girl option is checked
        var boyChecked = document.getElementById("boy").checked;
        console.log(boyChecked);
        var girlChecked = document.getElementById("girl").checked;
        console.log(girlChecked);
      //get the p element for displaying reasons
        var reason = document.getElementById('js-reason');
        //document.getElementById("reasons").appendChild(reason);
      //select certain outfit pieces base on temperature range
      //tempertaure above 32 Celsius
        if (tempRounded > 32) {
          reason.innerHTML = "It's scorching hot out! Cool off in this cool outfit."  
            if (boyChecked == true) {
              //show the corresponding outfit img
                document.getElementById("m_tank").classList.remove('hide');
                document.getElementById("m_board_shorts").classList.remove('hide');
                document.getElementById("m_flip_flops").classList.remove('hide');
        }
            else if(girlChecked == true) {
                document.getElementById("f_tank").classList.remove('hide');
                document.getElementById("f_shorts").classList.remove('hide');
                document.getElementById("f_flip_flops").classList.remove('hide');
            }
            else {
                document.getElementById("m_tank").classList.remove('hide');
                document.getElementById("m_cutoffs").classList.remove('hide');
                document.getElementById("m_flip_flops").classList.remove('hide');
            }
        }
      //temperature range between 27 and 32 Celsius
        if (tempRounded < 32 && tempRounded >= 27) {
          reason.innerHTML = "It's pretty hot out. These pieces are perfect for staying cool." 
            if (boyChecked == true) {
                document.getElementById("m_tshirt").classList.remove('hide');
                document.getElementById("m_cutoffs").classList.remove('hide');
                document.getElementById("m_high_tops").classList.remove('hide');
            }
            else if(girlChecked == true) {
                document.getElementById("f_tshirt").classList.remove('hide');
                document.getElementById("f_skirt").classList.remove('hide');
                document.getElementById("f_sandals").classList.remove('hide');
            }
            else {
                document.getElementById("m_tshirt").classList.remove('hide');
                document.getElementById("m_cutoffs").classList.remove('hide');
                document.getElementById("m_high_tops").classList.remove('hide');
            }
        }
      //temperature range between 21 and 27 Celsius
        if (tempRounded < 27 && tempRounded >= 21) {
          reason.innerHTML = "The weather is nice and warm, so enjoy the air in this outfit." 
            if (boyChecked == true) {
                document.getElementById("m_polo").classList.remove('hide');
                document.getElementById("m_cuffed_khakis").classList.remove('hide');
                document.getElementById("m_running_shoes").classList.remove('hide');
            }
            else if (girlChecked == true) {
                document.getElementById("f_c_dress").classList.remove('hide');
                document.getElementById("f_flats").classList.remove('hide');
            }
            else {
                document.getElementById("m_baseball_t").classList.remove('hide');
                document.getElementById("m_cuffed_khakis").classList.remove('hide');
                document.getElementById("m_sneakers").classList.remove('hide');
            }
        }
      //temperature range between 16 and 21 celsius
        if (tempRounded < 21 && tempRounded >= 16) {
          reason.innerHTML = "It's nice out but a little cool. Stay comfortable in these pieces. "          
            if (boyChecked == true) {
                document.getElementById("m_baseball_t").classList.remove('hide');
                document.getElementById("m_light_jeans").classList.remove('hide');
                document.getElementById("m_high_tops").classList.remove('hide');
        }
            else if (girlChecked == true) {
                document.getElementById("f_cardigan").classList.remove('hide');
                document.getElementById("f_light_jeans").classList.remove('hide');
                document.getElementById("f_sneakers").classList.remove('hide');
            }
            else {
                document.getElementById("m_baseball_t").classList.remove('hide');
                document.getElementById("m_light_jeans").classList.remove('hide');
                document.getElementById("m_running_shoes").classList.remove('hide');
            }
        }
      //temperature range between 10 and 16 Celsius
        if (tempRounded < 16 && tempRounded >= 10) {
          reason.innerHTML = "The weather is cool but still comfortable. This outfit is perfect for this nice day."           
            if (boyChecked == true) {
                document.getElementById("m_cardigan").classList.remove('hide');
                document.getElementById("m_sweatpants").classList.remove('hide');
                document.getElementById("m_sneakers").classList.remove('hide');
            }
            else if(girlChecked == true) {
              document.getElementById("f_jean_jacket").classList.remove('hide');
              document.getElementById("f_leggings").classList.remove('hide');
              document.getElementById("f_riding_boots").classList.remove('hide');
            }
            else {
                document.getElementById("f_jean_jacket").classList.remove('hide');
                document.getElementById("m_sweatpants").classList.remove('hide');
                document.getElementById("m_sneakers").classList.remove('hide');
            }
        }
      //temperature range between 0 and 10 Celsius
        if (tempRounded < 10 && tempRounded >= 0) {
              reason.innerHTML = "The cold is upon us! Cover up, and don't forget a coat."       
            if (boyChecked == true) {
                document.getElementById("m_peacoat").classList.remove('hide');
                document.getElementById("m_khakis").classList.remove('hide');
                document.getElementById("m_boots").classList.remove('hide');
            }
            else if (girlChecked == true) {
                document.getElementById("f_peacoat").classList.remove('hide');
                document.getElementById("f_dark_jeans").classList.remove('hide');
                document.getElementById("f_combat_boots").classList.remove('hide');
            }
            else {
                document.getElementById("m_peacoat").classList.remove('hide');
                document.getElementById("m_khakis").classList.remove('hide');
                document.getElementById("m_boots").classList.remove('hide');
            }
        }
      //temperature below 0 Celsius
        if (tempRounded < 0) {
          reason.innerHTML = "It's freezing outside! Bundle up and grab your best boots." 
            if (boyChecked == true) {
                document.getElementById("m_winter_coat").classList.remove('hide');
                document.getElementById("m_dark_jeans").classList.remove('hide');
                document.getElementById("m_snow_boots").classList.remove('hide');
            }
            else if (girlChecked == true) {
                document.getElementById("f_winter_coat").classList.remove('hide');
                document.getElementById("f_fleece_leggings").classList.remove('hide');
                document.getElementById("f_snow_boots").classList.remove('hide');
            }
            else {
                document.getElementById("m_winter_coat").classList.remove('hide');
                document.getElementById("m_dark_jeans").classList.remove('hide');
                document.getElementById("m_snow_boots").classList.remove('hide');
            }
        }
        //document.getElementById("empty").appendChild(reason);
      //if it rains, tell user to bring umbrella
        if (rainOrNot == true) {
          //var rain = document.getElementById("js-rain");
          reason.innerHTML += " And don't forget an umbrella!"
        }
        //tring to fix the footer on large screens
        if (window.innerHeight <= 700) {
        document.getElementById('form-footer').style = "position: unset";
        console.log(document.getElementById('form-footer').style.position);
        }
    }
});