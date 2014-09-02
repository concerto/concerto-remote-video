var initializedRemoteVideoHandlers = false;
function initializeRemoteVideoHandlers() {
  if (!initializedRemoteVideoHandlers) {

    function getVideoInfo() {
      // need to know which vendor
      // will place title, description, duration into 'div.remote-video-info'

      var info = '<p>Video details could not be determined.</p>';
      var vendor = $('select#remote_video_config_video_vendor').val();
      var video_id = $('input#remote_video_config_video_id').val();
      var info_el = $('.remote-video-info');
      var preview_div = $('#preview_div');
      $(preview_div).empty();

      if (info_el.length != 0) {
        // we found the summary box
        if (typeof vendor != 'undefined') {
          // we found the vendor selection, call appropriate api
          if (vendor == 'YouTube') {
            $(info_el).empty().html('<i class=\"ficon-spinner icon-spin\"></i> searching...');
            // todo: dont search if video_id is empty
            $.ajax({
              url: '//gdata.youtube.com/feeds/api/videos?q='+ encodeURIComponent(video_id) +'&v=2&max-results=1&format=5&alt=jsonc',
              dataType: 'jsonp',
              timeout: 4000,
              success: function (data) {
                if (parseInt(data['data']['totalItems']) > 0) {
                  // we got something, repoint data to first item in results
                  data = data['data']['items'];
                  $(info_el).empty().html('<img src="' + data[0].thumbnail.hqDefault + '"/><h4>' + data[0].title + '</h4><i>' + data[0].duration + ' secs</i><br/><p>' + data[0].description + '</p>');
                  previewVideo(data[0].id);
                } else {
                  $(info_el).empty().html(info);
                }
              },
              error: function (xoptions, textStatus)  {
                $(info_el).empty().html(info);
              }
            });
          } else if (vendor == 'Vimeo') {
            $(info_el).empty().html('<i class=\"ficon-spinner icon-spin\"></i> searching...');
            $.ajax({
              url: '//vimeo.com/api/v2/video/' + encodeURIComponent(video_id) + '.json',
              dataType: 'jsonp',
              timeout: 4000,
              success: function (data) {
                if (data.length > 0) {
                  // we got something
                  $(info_el).empty().html('<img src="' + data[0].thumbnail_small + '"/><h4>' + data[0].title + '</h4><i>' + data[0].duration + ' secs</i><br/><p>' + data[0].description + '</p>');
                  previewVideo();
                } else {
                  $(info_el).empty().html(info);
                }
              },
              error: function (xoptions, textStatus)  {
                $(info_el).empty().html(info);
              }
            });
          } else if (vendor == 'HTTPVideo') {
            $(info_el).empty();
            if (video_id != "")
            {
              previewVideo();
            }
          }
        }
      }
    }

    function previewVideo(video_id) {
      var url = $('input#remote_video_config_video_id').data('url');
      if (url) {
        if (video_id == null) {
          video_id = $('input#remote_video_config_video_id').val();
        }
        $("#preview_div").load(url, { data: { 
          video_vendor: $('select#remote_video_config_video_vendor').val(), 
          video_id: video_id, 
          allow_flash: $('input#remote_video_config_allow_flash').val(),
          duration: $('input#remote_video_duration').val(),
          name: $('input#remote_video_name').val()
        }, type: 'RemoteVideo' });
      }
    }

    function updateTooltip() {
      var vendor = $('select#remote_video_config_video_vendor').val();
      if (vendor == 'YouTube') {
        $('input#remote_video_config_video_id').attr("placeholder", "DGbqvYbPZBY");
        $('div#video_id_hint').html('Specify the video id or keywords');
      } else if (vendor == 'Vimeo') {
        $('input#remote_video_config_video_id').attr("placeholder", "4224811");
        $('div#video_id_hint').html('Specify the exact vimeo video id');
      } else if (vendor == 'HTTPVideo') {
        $('input#remote_video_config_video_id').attr("placeholder", "http://media.w3.org/2010/05/sintel/trailer.mp4");
        $('div#video_id_hint').html('Specify the url of the video');
      }
    }

    $('input#remote_video_config_video_id').on('blur', getVideoInfo);
    $('select#remote_video_config_video_vendor').on('change', getVideoInfo);
    $('select#remote_video_config_video_vendor').on('change', updateTooltip);

    initializedRemoteVideoHandlers = true;
  }
}

$(document).ready(initializeRemoteVideoHandlers);
$(document).on('page:change', initializeRemoteVideoHandlers);
