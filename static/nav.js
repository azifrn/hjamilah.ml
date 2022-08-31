var pageContent;

$("document").ready(function () {
  getCurrentPageID();
  changePage(currentPageID);
});
window.onpopstate = function (event) {
  // console.log(event.state);
  if (event.state != null) {
    //if history.back() to the first landing page
    changePage(event.state,'replace');
  }
};
function changePage(target, self, state = "push") {
  target_pageid = target.split("-")[0];
  if (target.split("-").length > 1) {
    target_subpageid = "/" + target.split("-")[1];
  } else {
    target_subpageid = "";
  }

  $.ajax({
    type: "GET",
    url: "/content/" + target_pageid + target_subpageid,
    dataType: "html",
    beforeSend: function () {
      $("#loadbar").show();
    },
    success: function (response) {
      $("#loadbar").hide();
      $("#content").html(response);
      window.scrollTo(0, 0);

      $(".nav-active").removeClass("nav-active"); //init all btn
      $(".subnav-active").removeClass("subnav-active");
      mobileNavToggle("off");

      $("#nav-" + target_pageid).addClass("nav-active");
      $(self).addClass("subnav-active");
      document.title = pagetitle + " | Dr. Jamilah";

      if (state == "replace") {
        window.history.replaceState(target_pageid, "", "/" + target_pageid);
      } else {
        window.history.pushState(
          target_pageid + target_subpageid,
          "",
          "/" + target_pageid + target_subpageid
        );
      }
    },
    error: function (response) {
      //   $("#loadbar").hide();
    },
  });
}

function mobileNavToggle(status = "on") {
  if (status == "on") {
    $("#navbar").toggleClass("mhidden");
    $("#mobile-navtoggle").toggleClass("rotate90");
  } else {
    $("#navbar").addClass("mhidden");
  }
}

$(".navdropdown").bind("click", function () {
  if ($(window).width() < 820) {
    $(this).children(".dropdown-content").toggle();
  }
});

function getCurrentPageID() {
  let path = location.pathname;

  if (location.pathname != "/") {
    let pathArray = path.split("/");

    if (pathArray.length <= 2) {
      //if one subdir
      currentPageID = path.split("/")[1]; //the subdir
    } else {
      currentPageID = path.split("/")[1] + "-" + path.split("/")[2];
    }

    // console.log(currentPageID);
  } else {
    currentPageID = "personal-pinfo"; //if no path, go to about (default).
  }
}
