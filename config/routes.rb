Rails.application.routes.draw do
  resources :remote_videos, :controller => :contents, :except => [:index, :show], :path => "content"
end
