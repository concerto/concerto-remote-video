module ConcertoRemoteVideo
  class RemoteVideoController < ConcertoRemoteVideo::ApplicationController
    def preview
      @video_data = RemoteVideo.preview({
        video_vendor: params[:video_vendor],
        video_id: params[:video_id],
        allow_flash: params[:allow_flash],
        name: params[:name],
        duration: params[:duration]
      })
      
      render json: @video_data
    end
  end
end