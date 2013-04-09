require 'rails/generators'

module ConcertoRemoteVideo
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('../../../../', __FILE__)

    desc 'Copy the RemoteVideo JavaScript to the frontend and register it.'

    def install
     copy_js
     register
    end

  private
    def copy_js
      copy_file 'public/frontend_js/contents/remote_video.js', 'public/frontend_js/contents/remote_video.js'
    end

    def register
      append_file 'public/frontend_js/content_types.js', "goog.require('concerto.frontend.Content.RemoteVideo');\n"
    end
  end
end
