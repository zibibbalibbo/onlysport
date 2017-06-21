var MenuManager = {
  $menuBar: null,
  init: function() {
    this.$menuBar = $('.menu-bar');
    this.$menuBar.click((e) => {
      this.$menuBar.toggleClass('menu-in-sight');
    });
  }
}

$(document).ready(function() {
  MenuManager.init();
});
