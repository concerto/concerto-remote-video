module ConcertoRemoteVideo
  class Engine < ::Rails::Engine
    isolate_namespace ConcertoRemoteVideo

    initializer "register content type" do |app|
      app.config.content_types << RemoteVideo
    end
  end
end
