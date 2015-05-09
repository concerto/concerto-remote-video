module ConcertoRemoteVideo
  class RemoteVideoController < ConcertoRemoteVideo::ApplicationController
    def preview
      @preview_data = RemoteVideo.preview({
        video_vendor: params[:video_vendor],
        video_id: params[:video_id],
        allow_flash: params[:allow_flash],
        name: params[:name],
        duration: params[:duration]
      })
      
      render json: {preview: @preview_data}
    end
  end
end