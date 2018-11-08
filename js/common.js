var MenuManager = {
    $menuBar: null,
    $headerWrapper: null,
    init: function () {
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
    updateMenuPosition: function () {
        if (this.$headerWrapper.height() - this.$menuBar.height() <= $(window).scrollTop()) {
            this.$headerWrapper.addClass('fixed');
        } else {
            this.$headerWrapper.removeClass('fixed');
        }
    }
};

var WallManager = {
    $wallWrapper: null,
    init: function () {
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
    isotopeLayout: function () {
        this.$wallWrapper.isotope('layout');
    },
    imageError: function (e) {
        $(e).remove();
    }
};

var CookieBar = {
    element: null,
    init: function () {
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
    destroy: function () {
        $.cookie("cookie-cookie", "agreed");
        this.element.removeClass('inside');
        setTimeout(() => {
            this.element.remove();
        }, 2000);
    }
};

var ScrollManager = {
    init: function () {
        var $scrollBtn = $('.scroll-down');
        if ($scrollBtn.length > 0) {
            $scrollBtn.click(() => {
                this.scroll();
            });
        }

        if (document.location.hash == '#scrolldown') {
            setTimeout(() => {
                this.scroll();
            }, 500);
        }

        $('.menu-element.active').click(() => {
            this.scroll();
        });
    },
    scroll: function () {
        var top = window.innerHeight - $('.total-wrapper .header-wrapper .menu-bar').height() + 1;
        $('html, body').animate({
            scrollTop: top + 'px'
        }, 800);
    }
}

var SponsorBar = {
    init: function () {
        let $sBar = $('.sponsor-bar');
        let $wrapper = $sBar.find('.sponsor-wrapper');
        let movement = 300;
        let sense = -1;
        this.printSponsor($wrapper).then(() => {
            if ($wrapper.width() > $(window).width()) {
                $sBar.addClass('scrolling');

                setInterval(() => {
                    let left = parseInt($wrapper.css('left').replace('px', ''));

                    if (sense == -1 && (left * -1) >= ($wrapper.width() - $(window).width())) {
                        sense = 1;
                    }
                    if (sense == 1 && left >= 0) {
                        sense = -1;
                    }

                    left = left + (movement * sense);

                    $wrapper.animate({
                        left: left + 'px'
                    }, 2500);
                }, 3000)
            }
        }, () => {
            $sBar.remove();
        });
    },
    printSponsor: function ($wrapper) {
        return new Promise((resolve, reject) => {
            $.get({
                url: "/data/sponsor.json",
                dataType: 'json'
            }).then((data) => {
                for (let row in data) {
                    for (let s in data[row]) {
                        let sp = data[row][s];
                        $wrapper.append(`<a class="sponsor" href="${sp.url}"><img src="/img/loghi/${sp.image}" alt="${sp.name}"></a>`);
                    }
                }
                setTimeout(() => {
                    resolve(true);
                }, 100)
            }, () => {
                console.log('errore');
                reject(false);
            });
        });
    }
}

var sharer = {
    getId: function () {
        if (document.location.href.indexOf('?') >= 0) {
            let paramString = document.location.href.split('?')[1];
            if (paramString.indexOf('&') >= 0) {
                let params = paramString.split('&');
                for (let key in Object.keys(params)) {
                    if (params[key].indexOf('=') >= 0 && "id" == params[key].split('=')[0]) {
                        return params[key].split('=')[1];
                    }
                }
            } else {
                if (paramString.indexOf('=') >= 0 && "id" == paramString.split('=')[0]) {
                    return paramString.split('=')[1];
                }
            }
        }
        return null;
    },
    _encodeUrl: function (s) {
        s = encodeURI(s);
        s = s.replace(/&/g, '%26');
        s = s.replace(/#/g, '%23');
        s = s.replace(/\+/g, '%2B');
        s = s.replace(/@/g, '%40');
        s = s.replace(/:/g, '%3A');
        return s;
    },
    shareFB: function (id) {
        var url = document.location.href += "?id=" + id;
        document.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + this._encodeUrl(url);
    }
}

$(document).ready(function () {
    CookieBar.init();
    MenuManager.init();
    WallManager.init();
    ScrollManager.init();
    SponsorBar.init();
});
