#!/usr/bin/node
/* global $ */
$(document).ready(function () {
  listAmenitiesChecked();
  checkStatus();
  places();
  searchAmenitiesChecked();
});

const listAmenitiesCheck = [];
const listAmenitiesIdsCheck = [];

function listAmenitiesChecked() {
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
      if (!listAmenitiesCheck.includes(this.name)) {
        listAmenitiesCheck.push(this.name);
        listAmenitiesIdsCheck.push(this.id);
      }
    } else {
      const index = listAmenitiesCheck.indexOf(this.name);
      listAmenitiesCheck.splice(index, 1);
      listAmenitiesIdsCheck.splice(index, 1);
    }
    $(".amenities h4").text(listAmenitiesCheck.join(", "));
  });
}

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

function places(filters = {}) {
  $.ajax({
    type: "post",
    url: `http://127.0.0.1:5001/api/v1/places_search/`,
    contentType: "application/json",
    data: JSON.stringify(filters),
    success: function (places) {
      $(".places").empty();
      for (const place of places) {
        const placeHtml = `
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
                ${place.number_rooms} Bedroom${
          place.number_rooms !== 1 ? "s" : ""
        }
              </div>
              <div class="number_bathrooms">
                ${place.number_bathrooms} Bathroom${
          place.number_bathrooms !== 1 ? "s" : ""
        }
              </div>
            </div>
            <div class="user">
              <b>Owner:</b> ${place.user?.first_name ?? "undefined"} ${
          place.user?.last_name ?? "undefined"
        }
            </div>
            <div class="description">${place.description}</div>
          </article>`;
        $(".places").append(placeHtml);
      }
    },
    error: function (xhr, status, error) {
      console.error("connection error: ", status, error);
    },
  });
}

function searchAmenitiesChecked() {
  $(".filters button").on("click", function () {
    places({ amenities: listAmenitiesIdsCheck });
  });
}
