  // var userId = '115731799271955360922';
  // var userId = '+GoPro';
  var userId = '+CMSExperiment';
  var collection = 'public';
  var apikey = 'AIzaSyBdGn4wiV_C-8aPINPvp3SSHJCmLn2YJGw';
  var itemsPerPage = 20;

  var SocialManager = {
    loadGoogleActivities: function(pageToken) {
      var url = 'https://www.googleapis.com/plus/v1/people/' + userId + '/activities/' + collection + '?key=' + apikey + '&maxResults=' + itemsPerPage;

      if (!!pageToken) {
        url += '&pageToken=' + pageToken;
      }

      return $.get(url);
    },
    loadActivityDetail: function(activityId) {
      var url = 'https://www.googleapis.com/plus/v1/activities/' + activityId + '?key=' + apikey;
      return $.get(url);
    }
  }

  var HomeManager = {
    nextPageToken: null,
    $wallWrapper: null,
    $loadmore: null,
    $popup: null,
    init: function() {
      this.$wallWrapper = $('#grid');
      this.$popup = $('#popup-wrapper');
      this.$body = $('body');
      this.$loadMore = $('.load-more');

      this.$popup.find('.close').click(() => {
        this.closeDetail();
      });
      this.$popup.click(() => {
        this.closeDetail();
      });
      this.$wallWrapper.on('click', '.grid-item', (e) => {
        var dataSource = $(e.currentTarget).data('source');
        this.openDetail(dataSource);
      });
      this.$loadMore.click((e) => {
        this.$loadMore.addClass('hidden');
        this.loadElements();
      });
      this.loadElements();
    },
    createItems: function(items) {
      var initial = this.$wallWrapper.data('loaded-elements') || 0;
      var htmlObjs = [];
      $(items).each((i, el) => {
        var $item = $('<div class="grid-item"></div>');
        $item.append(this.createThumb(el, true));
        $item.data('source', el);
        $item.attr('index', i + initial);

        if ($item.html().length > 1) {
          htmlObjs.push($item);
        }
      });

      this.$wallWrapper.data('loaded-elements', items.length + initial);
      return htmlObjs;
    },
    clearItems: function() {
      this.$wallWrapper.html('');
    },
    createThumb: function(data, smallThumb) {
      var obj = data.object.attachments[0];
      var text = data.object.content;
      if (!!text && text.length > 10) {
        var html = '';

        var imgSizes = {
          height: 336,
          width: 506,
          noDimensions: true
        }
        if (!!obj.fullImage && !!obj.fullImage.height) {
          imgSizes.height = obj.fullImage.height;
          imgSizes.width = obj.fullImage.width;
          imgSizes.noDimensions = false;
        } else if (!!obj.image && !!obj.image.height) {
          imgSizes.height = obj.image.height;
          imgSizes.width = obj.image.width;
          imgSizes.noDimensions = false;
        }

        if (smallThumb) {
          if (!!obj.image) {
            html += `<img height="${imgSizes.height}" width="${imgSizes.width}" onload="WallManager.isotopeLayout();" onerror="WallManager.imageError(this);" class="preview-image ${imgSizes.noDimensions ? 'no-sizes' : ''}" src="${obj.image.url}">`;
          }
        } else {
          var paths = [];
          if (!!obj.fullImage) {
            paths.push(obj.fullImage.url);
          }
          if (!!obj.image) {
            paths.push(obj.image.url);
          }
          if (paths.length > 1) {
            html += `<div class="image" style="background-image: url('${paths[1]}');">
            <img class="detail-image" height="${imgSizes.height}" width="${imgSizes.width}" src="${paths[0]}">
            </div>`;
          } else if (paths.length == 1) {
            html += `<img class="detail-image" height="${imgSizes.height}" width="${imgSizes.width}" src="${paths[0]}">`;
          }
        }

        var date = new Date(data.updated);

        html += '<span class="date">' + date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear() + '</span>';
        html += '<span class="hour">' + date.getUTCHours() + ':' + date.getUTCMinutes() + '</span>';

        var underIndex = text.indexOf('_');
        if (underIndex > 0 && underIndex < 50) {
          html += '<h2 class="title">' + text.substring(0, underIndex) + '</h2>';
          text = text.substring(underIndex + 1);
        }

        if (smallThumb && text.length > 250) {
          text = text.substring(0, 247) + '...';
        }
        html += '<p class="text">' + text + '</p>';

        return html;
      }
    },
    openDetail: function(data) {
      this.$popup.find('.popup-body').html(this.createThumb(data));
      this.$body.addClass('show-popup');
    },
    closeDetail: function() {
      this.$body.removeClass('show-popup');
      this.$popup.find('.popup-body').html('');
    },
    loadElements: function() {
      SocialManager.loadGoogleActivities(this.nextPageToken)
        .done((resp) => {
          this.nextPageToken = resp.nextPageToken;
          var items = this.createItems(resp.items);
          this.$wallWrapper.trigger('isotope-add-items', [items]);
          this.$loadMore.removeClass('hidden');
        });
    }
  }



  // function loadFBPost() {
  //   $.get('http://graph.api.facebook/1613468286/feed');
  // }
  $(document).ready(function() {
    HomeManager.init();
  });
