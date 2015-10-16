module ConcertoRemoteVideo
  class Engine < ::Rails::Engine
    isolate_namespace ConcertoRemoteVideo

    initializer "register content type" do |app|
      app.config.content_types << RemoteVideo
    end

    # Define plugin information for the Concerto application to read
    def plugin_info(plugin_info_class)
      @plugin_info ||= plugin_info_class.new do
        add_route("concerto-remote-video", ConcertoRemoteVideo::Engine)
        add_view_hook "frontend/ScreensController", :concerto_frontend_plugins, partial: "frontend/concerto_remote_video.html"

        # Initialize configuration settings with a description and a default.
        # Administrators can change the value through the Concerto dashboard.
        add_config("vimeo_api_key", "", 
                   :value_type => "string",
                   :category => "API Keys",
                   :seq_no => 999,
                   :description => "Vimeo API Access Token.  This token is used for obtaining information about videos when adding video content. http://developer.vimeo.com/apps")

        add_config("youtube_api_key", "", 
                   :value_type => "string",
                   :category => "API Keys",
                   :seq_no => 999,
                   :description => "YouTube API Access Token.  This token is used for obtaining information about videos when adding video content. http://console.developers.google.com")

        # Some code to run at app boot
        init do
          require 'video_info'
          keys = {}
          keys[:vimeo] = ConcertoConfig["vimeo_api_key"] unless ConcertoConfig["vimeo_api_key"].blank?
          keys[:youtube] = ConcertoConfig["youtube_api_key"] unless ConcertoConfig["youtube_api_key"].blank?
          VideoInfo.provider_api_keys = keys
        end
      end
    end
  end
end
