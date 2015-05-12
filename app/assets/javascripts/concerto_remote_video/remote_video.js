var initializedRemoteVideoHandlers = false;
function initializeRemoteVideoHandlers() {
  if (!initializedRemoteVideoHandlers) {

    function getVideoPreview() {
      var preview_url = '/concerto-remote-video/preview';

      // Form video details
      var video_id = $('input#remote_video_config_video_id').val();
      var video_vendor = $('select#remote_video_config_video_vendor').val();

      // Loading icon
      if (video_id.length != 0) {
        $(preview_div).empty().html('<i class=\"ficon-spinner icon-spin\"></i> searching...');
        $('.remote-video-info').empty();
        // Video preview request
        $.ajax({
          type: 'POST',
          url: preview_url,
          data: { 
            video_id: video_id,
            video_vendor: video_vendor
          },
          success: function(data) {
            loadVideoInfo(data);
            loadVideoPreview(data); 
          },
          error: function(e) {
            loadVideoPreview({video_available: false});
          }
        });
      }
    }

    function loadVideoInfo(data) {
      if (data['video_available']) {
        var info_el = $('.remote-video-info');
        var name_el = $('input#remote_video_name');
        var title = '';
        var description = '<p></p>';

        if (data['video_vendor'] == "HTTPVideo") {
          $(info_el).empty();
          return;
        }
        else {
          if (data['description']) {
            var description = '<p>' + data['description'] + '</p>';
          }
          name_el.val(data['title']);
        } 

        // Load video info 
        var info = '<img src="'+data['thumb_url']+'"/></h4><i>' + data['duration'] + ' secs</i><br/>' + description; 
        $(info_el).empty().html(info);
      }
    }

    function loadVideoPreview(data) {
      var preview_el = $('#preview_div');
      if (data['video_available']) {
        $(preview_div).empty().html(data['preview_code']);
      } else {
        $(preview_div).empty();
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

    $('input#remote_video_config_video_id').on('blur', getVideoPreview);
    $('select#remote_video_config_video_vendor').on('change', getVideoPreview);
    $('select#remote_video_config_video_vendor').on('change', updateTooltip);

    initializedRemoteVideoHandlers = true;
  }
}

$(document).ready(initializeRemoteVideoHandlers);
$(document).on('page:change', initializeRemoteVideoHandlers);