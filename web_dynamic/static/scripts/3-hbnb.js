#!/usr/bin/node
/* global $ */

$(document).ready(function () {
  const listAmenitiesChecked = [];
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      if (!listAmenitiesChecked.includes(this.name)) {
        listAmenitiesChecked.push(this.name);
      }
    } else {
      const index = listAmenitiesChecked.indexOf(this.name);
      listAmenitiesChecked.splice(index, 1);
    }
    $(".amenities h4").text(listAmenitiesChecked.join(", "));
  });
  $.get("http://127.0.0.1:5001/api/v1/status", function (data) {
    if (data.status === "OK") {
      $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });
  // Fetch places dynamically
  $.ajax({
    url: "http://127.0.0.1:5001/api/v1/places_search/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({}), // Send empty JSON object
    success: function (places) {
      console.log("Places received:", places);
      $(".places").empty(); // Clear existing places
      places.forEach((place) => {
        const placeHTML = `
                  <article>
                      <h2>${place.name}</h2>
                      <div class="price_by_night">$${place.price_by_night}</div>
                      <div class="information">
                          <div class="max_guest">${place.max_guest} Guests</div>
                          <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                          <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                      </div>
                      <div class="description">${place.description}</div>
                  </article>`;
        $(".places").append(placeHTML);
      });
    },
    error: function () {
      console.error("Error fetching places");
    },
  });
});
