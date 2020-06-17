/* Open the sidenav */
function openNav() {
  document.getElementById("sideNavMenu").style.left = "0";
}

/* Close/hide the sidenav */
function closeNav() {
  document.getElementById("sideNavMenu").style.left = "-100%";
}

let hidden = true;
$(document).ready(function(e) {
  // Slide down animate the music dropdown
  $(".dropdownContent").hide();
  $(".dropdown").hover(function(e) {
    e.preventDefault();
    $(this).children(".dropdownContent").slideDown();
  },
  function(e) {
    $(this).children(".dropdownContent").hide();
  });
});
