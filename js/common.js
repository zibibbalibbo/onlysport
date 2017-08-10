var MenuManager = {
  $menuBar: null,
  $headerWrapper: null,
  init: function() {
    this.$menuBar = $('.menu-bar');
    this.$headerWrapper = $('.header-wrapper');

    this.$menuBar.click((e) => {
      this.$menuBar.toggleClass('menu-in-sight');
    });
    $(window).scroll(() => {
      this.updateMenuPosition();
    });
    $(window).resize(() => {
      this.updateMenuPosition();
    });
  },
  updateMenuPosition: function() {
    if (this.$headerWrapper.height() - this.$menuBar.height() <= $(window).scrollTop()) {
      this.$headerWrapper.addClass('fixed');
    } else {
      this.$headerWrapper.removeClass('fixed');
    }
  }
};

var WallManager = {
  $wallWrapper: null,
  init: function() {
    this.$wallWrapper = $('#grid');

    if (this.$wallWrapper.length > 0) {
      this.$wallWrapper.isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          columnWidth: ".grid-sizer",
          gutter: ".gutter-sizer"
        }
      });

      this.$wallWrapper.on('isotope-add-items', (e, items) => {
        for (var i = 0; i < items.length; i++) {
          this.$wallWrapper.isotope('insert', items[i]);
        }
      })
    }
  },
  isotopeLayout: function() {
    this.$wallWrapper.isotope('layout');
  },
  imageError: function(e) {
    $(e).remove();
  }
};

var CookieBar = {
  element: null,
  init: function() {
    if ($.cookie("cookie-cookie") != 'agreed') {
      this.element = $('body').append(`
      <div id="cookie-banner">
  				<span class="text">Utilizziamo i cookie per essere sicuri che tu possa avere la migliore esperienza sul nostro sito. Se continui ad utilizzare questo sito noi assumiamo che tu ne sia felice.</span>
  				<a class="close">Chiudi</a>
  		</div>
    `).find('#cookie-banner');

      this.element.find('.close').click(() => {
        this.destroy();
      });

      setTimeout(() => {
        this.element.addClass('inside');
      }, 2000);
    }
  },
  destroy: function() {
    $.cookie("cookie-cookie", "agreed");
    this.element.removeClass('inside');
    setTimeout(() => {
      this.element.remove();
    }, 2000);
  }
};

var ScrollManager = {
  init: function() {
    var $scrollBtn = $('.scroll-down');
    if ($scrollBtn.length > 0) {
      $scrollBtn.click(() => {
        this.scroll();
      });
    }

    if(document.location.hash == '#scrolldown') {
      setTimeout(() => {
        this.scroll();
      }, 500);
    }

    $('.menu-element.active').click(() => {
      this.scroll();
    });
  },
  scroll: function() {
    var top = window.innerHeight - $('.total-wrapper .header-wrapper .menu-bar').height() + 1;
    $('html, body').animate({
      scrollTop: top + 'px'
    }, 800);
  }
}

$(document).ready(function() {
  CookieBar.init();
  MenuManager.init();
  WallManager.init();
  ScrollManager.init();
});
