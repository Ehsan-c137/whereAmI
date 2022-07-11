"use strict";
const flagImage = document.querySelector(".country__flag");
const countryName = document.querySelector(".country__name");
const countryRegion = document.querySelector(".country__region");
const countryPopulation = document.querySelector(".country__population");
const countryCurrency = document.querySelector(".country__currency");
const button = document.querySelector(".button");

button.addEventListener("click", function () {
   getLocation();
});

const onSuccess = (position) => {
   const coords = position.coords;

   whereAmI(coords.latitude, coords.longitude);
};

const onError = (error) => {
   switch (error.code) {
      case error.PERMISSION_DENIED:
         renderErr("User denied the request for Geolocation.");
         return "User denied the request for Geolocation.";

      case error.POSITION_UNAVAILABLE:
         renderErr("Location information is unavailable.");

         return "Location information is unavailable.";

      case error.TIMEOUT:
         renderErr("The request to get user location timed out.");

         return "The request to get user location timed out.";
      case error.UNKNOWN_ERROR:
         renderErr("An unknown error occurred.");
         return "An unknown error occurred.";
      default:
         return " this is work";
   }
};
function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
   } else {
      alert("not support");
   }
}

function whereAmI(lat, lon) {
   const key = "13568997686770149542x116844";
   fetch(`https://geocode.xyz/${lat},${lon}?geoit=json&auth=${key}`)
      .then((res) => {
         if (!res.ok) {
            renderErr(`country not found! ${res.status}`);
            throw new Error(`Problem with geocoding. ${res.status}`);
         }

         return res.json();
      })
      .then((data) => {
         return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
      })
      .then((res) => {
         if (!res.ok) {
            renderErr(`country not found! ${res.status}`);
            throw new Error(`country not found! ${res.status}`);
         }
         return res.json();
      })
      .then((data) => {
         renderCountry(data);
      })
      .finally(() => {
         document.querySelector(".country__card").style.opacity = 1;
      });
}

function renderCountry(data) {
   flagImage.src = data[0].flags.svg;
   countryName.textContent = data[0].name.common;
   countryRegion.textContent = data[0].region;
   countryPopulation.textContent = data[0].population.toLocaleString();
   // countryCurrency.textContent = data[0].currencies;
}
const errCardText = document.querySelector(".error__card__text");
const errCard = document.querySelector(".error__card");
const errClose = document.querySelector(".error__card__close");

function renderErr(err) {
   errCard.style.opacity = 1;
   errCard.classList.add("error__card-active");
   errCardText.textContent = err;
}

errClose.addEventListener("click", function () {
   errCard.classList.remove("error__card-active");
});
