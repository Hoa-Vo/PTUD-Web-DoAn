let allDistrict;
$(document).ready(() => {
  $(".loader").css("display", "flex");
  upDateCheckoutInfo();
  updateCombobox();
});
function upDateCheckoutInfo() {
  pTagContent = $("#user-info").html();
  userID = pTagContent.split(">")[1].split("<")[0];
  $.ajax({
    url: "/api/get-cart/user",
    type: "GET",
    data: {
      userID: userID,
    },
    success: function (res) {
      updateCheckOutHtml(res);
    },
  });
}
function updateCheckOutHtml(books) {
  const source = $("#checkout-info").html();
  const template = Handlebars.compile(source);
  $("#info-list").html(template(books));
  let totalMoney = 0;
  for (let i = 0; i < books.length; i++) {
    totalMoney += books[i].totalPrice;
  }
  console.log(totalMoney);
  $("#total-money-pay").html(`${totalMoney} VND`);
  $("#money-pay").html(`${totalMoney} VND`);
}
function checkOutInfoIsValid() {
  const cityValue = $("#city").find(":selected").text();
  const districtValue = $("#district").find(":selected").text();
  const subDistrictValue = $("#sub-district").find(":selected").text();
  if (
    cityValue === "Vui lòng chọn tỉnh/thành phố" ||
    districtValue === "Vui lòng chọn quận/huyện" ||
    subDistrictValue === "Vui lòng chọn phường/xã"
  ) {
    $("html, body").animate({ scrollTop: 0 }, 500);
    if (cityValue === "Vui lòng chọn tỉnh/thành phố") {
      $(".city-invalid").css("display", "block");
    }
    if (districtValue === "Vui lòng chọn quận/huyện") {
      $(".district-invalid").css("display", "block");
    }
    if (subDistrictValue === "Vui lòng chọn phường/xã") {
      $(".sub-district-invalid").css("display", "block");
    }
  }
}
function updateCombobox() {
  $.ajax({
    url: "/api/get-city",
    type: "GET",
    success: function (res) {
      const citySource = $("#city-info").html();
      const template = Handlebars.compile(citySource);
      $("#city").html(template(res.allCityName));
      $(".loader").css("display", "none");
    },
  });
}
function cityChange() {
  $(".loader").css("display", "flex");
  $(".city-invalid").css("display", "none");
  const value = $("#city").find(":selected").text();
  $.ajax({
    url: "/api/get-district",
    type: "GET",
    data: {
      city: value,
    },
    success: function (res) {
      res.allDistrict.sort((a, b) => (a.name > b.name ? 1 : -1));
      $("#district").prop("disabled", false);
      const districtSource = $("#district-info").html();
      const template = Handlebars.compile(districtSource);
      $("#district").html(template(res.allDistrict));
      allDistrict = res.allDistrict;
      $(".loader").css("display", "none");
    },
  });
}
function districtChange() {
  $(".loader").css("display", "flex");
  $(".district-invalid").css("display", "none");
  const value = $("#district").find(":selected").text();
  const subDistrictArr = findDistrict(value);
  $("#sub-district").prop("disabled", false);
  const subDistrictSource = $("#sub-district-info").html();
  const template = Handlebars.compile(subDistrictSource);
  $("#sub-district").html(template(subDistrictArr));
  $(".loader").css("display", "none");
}
function findDistrict(value) {
  for (let i = 0; i < allDistrict.length; i++) {
    if (allDistrict[i].name === value) {
      return allDistrict[i].sub_district.sort();
    }
  }
}
