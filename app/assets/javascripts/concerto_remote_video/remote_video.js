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
        $(preview_div).empty().html('<i class=\"fas fa-spinner fa-spin\"></i> searching...');
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
            //loadVideoPreview({video_available: false});
            $(preview_div).empty().text(e.responseText);
          }
        });
      }
    }

    function loadVideoInfo(data) {
      if (data['video_available']) {
        // Target elements for setting video info
        var info_el = $('.remote-video-info');
        var name_el = $('input#remote_video_name');
        var duration_el = $('input#remote_video_duration');
        // Initialize info content
        var title = '';
        var description = '<p></p>';
        var duration = '';
        var vendor = data['video_vendor'];

        if (vendor == 'HTTPVideo') {
          $(info_el).empty();
          return;
        } else {
          // YouTube no longer returns these details without an API key
          if (vendor != 'YouTube') {
            if (data['description']) {
              // Preview video description
              var description = '<p>' + data['description'] + '</p>';
            } 
            if (data['title']) {
              // Set content title to video returned title
              name_el.val(data['title']);
            }
            if (data['duration']) {
              // Set content duration to video duration
              duration = '<i>' + data['duration'] + ' secs</i>';
              duration_el.val(data['duration']);
            }
          }
        } 

        // Load video info 
        var info = '<img src="'+data['thumb_url']+'"/></h4>'+duration+'<br/>'+description; 
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
      var hint_el = $('div#video_id_hint');
      var id_el = $('input#remote_video_config_video_id');

      if (vendor == 'YouTube') {
        id_el.attr('placeholder', 'DGbqvYbPZBY');
        hint_el.html('Specify the exact YouTube video id');
      } else if (vendor == 'Vimeo') {
        id_el.attr('placeholder', '4224811');
        hint_el.html('Specify the exact vimeo video id');
      } else if (vendor == 'HTTPVideo') {
        id_el.attr('placeholder', 'http://media.w3.org/2010/05/sintel/trailer.mp4');
        hint_el.html('Specify the url of the video');
      } else if (vendor == 'Wistia') {
        id_el.attr('placeholder', 'g5pnf59ala');
        hint_el.html('Specify the exact Wistia video id');
      } else if (vendor == 'DailyMotion') {
        id_el.attr('placeholder', 'x23shps');
        hint_el.html('Specify the exact DailyMotion video id');
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