  // var userId = '115731799271955360922';
  // var userId = '+GoPro';
  var userId = '+CMSExperiment';
  var collection = 'public';
  var apikey = 'AIzaSyDLKCjkDs0bfE0Y0NBEgcvB0APQST5KH-I';

  var SocialManager = {
    loadGoogleActivities: function(pageToken) {
      var url = 'https://www.googleapis.com/plus/v1/people/' + userId + '/activities/' + collection + '?key=' + apikey + '&maxResults=5';

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
    $popup: null,
    init: function() {
      this.$wallWrapper = $('#wall-wrapper');
      this.$popup = $('#popup-wrapper');
      this.$body = $('body');
      this.$loadMore = $('.load-more');

      this.$popup.find('.close').click(() => {
        this.closeDetail();
      });
      this.$wallWrapper.on('click', '.wall-item', (e) => {
        var dataSource = $(e.currentTarget).data('source');
        this.openDetail(dataSource);
      });
      this.$loadMore.click((e)=>{
        this.$loadMore.addClass('hidden');
        this.loadElements();
      });
      this.loadElements();
    },
    printItems: function(items) {
      var initial = this.$wallWrapper.data('loaded-elements') || 0;
      $(items).each((i, el) => {
        var $item = $('<div class="wall-item"></div>');
        $item.append(this.createThumb(el, true));
        $item.data('source', el);
        $item.attr('index', i + initial);
        this.$wallWrapper.append($item);
      });

      this.$wallWrapper.data('loaded-elements', items.length + initial);
    },
    clearItems: function() {
      this.$wallWrapper.html('');
    },
    createThumb: function(data, smallThumb) {
      var obj = data.object.attachments[0];
      var text = data.object.content;
      if (!!text && text.length > 10) {
        var html = '';

        if (smallThumb) {
          if (!!obj.image) {
            html += `<img class="preview-image" src="${obj.image.url}">`;
          }
        } else {
          if (!!obj.fullImage) {
            html += `<div class="image" style="background-image: url('${obj.image.url}');">
            <img class="detail-image" height="${obj.fullImage.height}" width="${obj.fullImage.width}" src="${obj.fullImage.url}">
            </div>`;
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
        .done(function(resp) {
          HomeManager.nextPageToken = resp.nextPageToken;
          HomeManager.printItems(resp.items);
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
