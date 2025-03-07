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
  checkStatus();
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
