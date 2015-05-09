var initializedRemoteVideoHandlers = false;
function initializeRemoteVideoHandlers() {
  if (!initializedRemoteVideoHandlers) {

    function getVideoPreview() {
      var preview_url = '/concerto-remote-video/preview';
      var preview_div = $('#preview_div');
      var video_id = $('input#remote_video_config_video_id').val();
      var video_vendor = $('select#remote_video_config_video_vendor').val();

      if (preview_div.length != 0) {
        $(preview_div).empty().html('<i class=\"ficon-spinner icon-spin\"></i> searching...');
        $.ajax({
          type: 'POST',
          url: preview_url, 
          data: { 
            video_id: video_id,
            video_vendor: video_vendor,
          },
          success: function(data) {
            $(preview_div).empty().html(data['preview']);
          }, 
          error: function(data) {
            $(preview_div).empty().html(data['preview']);
          }
        });
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