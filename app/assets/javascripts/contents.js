// contents.js

// attach handler to video_id so when it loses focus we can look up some video details
// not dry, but no middle man
function attachHandlers() {
  $('input#remote_video_config_video_id').on('blur', getVideoInfo);
  $('select#remote_video_config_video_vendor').on('change', getVideoInfo);

  function getVideoInfo() {
    // need to know which vendor
    // will place title, description, duration into 'div.remote-video-info'

    var info = '<p>Video details could not be determined.</p>';
    var vendor = $('select#remote_video_config_video_vendor').val();
    var video_id = $('input#remote_video_config_video_id').val();
    var info_el = $('.remote-video-info');

    if (info_el.length != 0) {
      // we found the summary box
      if (typeof vendor != 'undefined') {
        // we found the vendor selection, call appropriate api
        if (vendor == 'YouTube') {
          $(info_el).empty().html('searching...');
          // todo: dont search if video_id is empty
          $.ajax({
            url: 'http://gdata.youtube.com/feeds/api/videos?q='+ encodeURIComponent(video_id) +'&v=2&max-results=1&format=5&alt=jsonc',
            dataType: 'jsonp',
            timeout: 4000,
            success: function (data) {
              if (parseInt(data['data']['totalItems']) > 0) {
                // we got something, repoint data to first item in results
                data = data['data']['items'];
                $(info_el).empty().html('<img src="' + data[0].thumbnail.hqDefault + '"/><h4>' + data[0].title + '</h4><i>' + data[0].duration + ' secs</i><br/><p>' + data[0].description + '</p>');
              } else {
                $(info_el).empty().html(info);
              }
            },
            error: function (xoptions, textStatus)  {
              $(info_el).empty().html(info);
            }
          });
        } else if (vendor == 'Vimeo') {
          $(info_el).empty().html('searching...');
          $.ajax({
            url: 'http://vimeo.com/api/v2/video/' + encodeURIComponent(video_id) + '.json',
            dataType: 'jsonp',
            timeout: 4000,
            success: function (data) {
              if (data.length > 0) {
                // we got something
                $(info_el).empty().html('<img src="' + data[0].thumbnail_small + '"/><h4>' + data[0].title + '</h4><i>' + data[0].duration + ' secs</i><br/><p>' + data[0].description + '</p>');
              } else {
                $(info_el).empty().html(info);
              }
            },
            error: function (xoptions, textStatus)  {
              $(info_el).empty().html(info);
            }
          });
        }
      }
    }
  }
}

$(document).ready(attachHandlers);
$(document).on('page:change', attachHandlers);
