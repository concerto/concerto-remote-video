// contents.js

// attach handler to video_id so when it loses focus we can look up some video details
// not dry, but no middle man
function attachHandlers() {
  $('input#remote_video_config_video_id').on('blur', getVideoInfo);

  function getVideoInfo() {
    // need to know which vendor
    // will place title, description, duration into 'div.remote-video-info'

    var info = '<p>Video details could not be determined.</p>';
    var vendor = $('select#remote_video_config_video_vendor').val();
    var video_id = $(this).val();
    var info_el = $('.remote-video-info');

    if (info_el.length != 0) {
      // we found the summary box
      if (typeof vendor != 'undefined') {
        // we found the vendor selection, call appropriate api
        if (vendor == 'YouTube') {
          // todo
        } else if (vendor == 'Vimeo') {
          $.getJSON('http://vimeo.com/api/v2/video/' + encode(video_id) + '.json',
            function (data) {
              if (data.length > 0) {
                // we got something
                // success
                $(info_el).replaceWith('<h1>' + data[0].title + '</h1><p>' + data[0].description + '</p>');
              } else {
                $(info_el).replaceWith(info);
              }
            }).fail(function() {
              // failure
              $(info_el).replaceWith(info);
            });
        }
      }
    }
  }
}

$(document).ready(attachHandlers);
$(document).on('page:change', attachHandlers);
