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
      end
    end
  end
end