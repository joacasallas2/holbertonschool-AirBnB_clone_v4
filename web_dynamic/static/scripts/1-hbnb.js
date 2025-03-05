#!/usr/bin/node
/* global $ */
$(document).ready(function () {
  const listAmenitiesChecked = [];
  $('.amenities input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      if (!listAmenitiesChecked.includes(this.name)) {
        listAmenitiesChecked.push(this.name);
      }
    } else {
      const index = listAmenitiesChecked.indexOf(this.name);
      listAmenitiesChecked.splice(index, 1);
    }
    $('.amenities h4').text(listAmenitiesChecked.join(', '));
  });
});
