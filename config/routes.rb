Rails.application.routes.draw do
  resources :remote_videos, :controller => :contents, :except => [:index, :show], :path => "content"
end

ConcertoRemoteVideo::Engine.routes.draw do
  post "preview", to: ConcertoRemoteVideo::RemoteVideoController.action(:preview)
end