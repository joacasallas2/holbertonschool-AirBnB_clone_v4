#!/usr/bin/node
/* global $ */
$(document).ready(function () {
  checkStatus();
  places();
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
});

function checkStatus() {
  $.get("http://127.0.0.1:5001/api/v1/status")
    .done(function (data) {
      if (data.status === "OK") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    })
    .fail(function (xhr, status, error) {
      console.error("connection error: ", status, error);
      $("#api_status").removeClass("available");
      if (status === "error") {
        console.log(
          "Cannot connect to the API server, please check if it is running"
        );
      }
    });
}

function places() {
  $.post({
    url: "http://127.0.0.1:5001/api/v1/places_search/",
    contentType: "application/json",
    data: JSON.stringify({}),
  })
    .done(function (places) {
      places.forEach((place) => {`
          <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">
              ${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}
            </div>
            <div class="number_rooms">
              ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? "s" : ""}
            </div>
            <div class="number_bathrooms">
              ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? "s" : ""}
            </div>
          </div>
          <div class="user">
            <b>Owner:</b> ${place.user?.first_name || "Unknown"} ${place.user?.last_name || "Unknown"}
          </div>
          <div class="description">${place.description}</div>
        </article>`;
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Cannot connect: ", status, error);
      console.error("Response Text: ", xhr.responseText);
    });
}
