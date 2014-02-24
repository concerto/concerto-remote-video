class RemoteVideo < Content
  after_initialize :set_kind, :create_config, :load_info

  after_find :load_config
  before_validation :save_config

  validate :video_id_must_exist
  #todo: put back, commented out because I keep getting duration is not a number
  #validates :duration, :numericality => { :greater_than => 0 }
  validate :video_vendor_supported

  DISPLAY_NAME = 'Video'
  VIDEO_VENDORS = {
    :YouTube => { :id => "YouTube", :url => "https://www.youtube.com/embed/" },
    :Vimeo => { :id => "Vimeo", :url => "https://player.vimeo.com/video/" },
    :HTTPVideo => { :id => "HTTP Video Source", :url => ""}
  }

  attr_accessor :config

  # Automatically set the kind for the content
  # if it is new.  We use this hidden type that no fields
  # render so Dynamic Content meta content never gets displayed.
  def set_kind
    return unless new_record?
    self.kind = Kind.where(:name => 'Graphics').first
  end

  # Create a new configuration hash if one does not already exist.
  # Called during `after_initialize`, where a config may or may not exist.
  def create_config
    self.config = {} if !self.config
  end

  # Load a configuration hash.
  # Converts the JSON data stored for the content into the configuration.
  # Called during `after_find`.
  def load_config
    self.config = JSON.load(self.data)
  end

  # Prepare the configuration to be saved.
  # Compress the config hash back into JSON to be stored in the database.
  # Called during `before_valication`.
  def save_config
    self.data = JSON.dump(self.config)
  end

  def self.form_attributes
    attributes = super()
    # what about  :thumb_url, :title, :description
    attributes.concat([:config => [:video_vendor, :video_id, :allow_flash]])
  end

  # Load some info about this video from YouTube.
  def load_info
    # dont abort if there is a duration specified
    return if self.config['video_id'].nil? #|| !self.duration.nil?
    require 'net/http'
    if self.config['video_vendor'] == VIDEO_VENDORS[:YouTube][:id]
      #begin
        video_id = URI.escape(self.config['video_id'])
        url = "http://gdata.youtube.com/feeds/api/videos?q=#{video_id}&v=2&max-results=1&format=5&alt=jsonc"
        json = Net::HTTP.get_response(URI.parse(url)).body
        data = ActiveSupport::JSON.decode(json)
      #rescue
      #  Rails.logger.debug("YouTube not reachable @ #{url}.")
      #  config['video_id'] = ''
      #  return
      #end
      if data['data']['totalItems'].to_i <= 0
        Rails.logger.debug('No video found from ' + url)
        self.config['video_id'] = ''
        return
      end
      video_data = data['data']['items'][0]
      self.config['video_id'] = video_data['id']
      self.duration = video_data['duration'].to_i
      self.config['thumb_url'] = video_data['thumbnail']['hqDefault']
      self.config['title'] = video_data['title']
      self.config['description'] = video_data['description']
    elsif self.config['video_vendor'] == VIDEO_VENDORS[:Vimeo][:id]
      #todo: put these info urls in the VV constant
      #http://vimeo.com/api/v2/video/video_id.json
      data=[]
      #begin
        video_id = URI.escape(self.config['video_id'])
        url = "http://vimeo.com/api/v2/video/#{video_id}.json"
        uri = URI.parse(url)
        http = Net::HTTP.new(uri.host, uri.port)
        request = Net::HTTP::Get.new(uri.request_uri)
        response = http.request(request)
        if response.code == '200'  #ok
          json = response.body
          data = ActiveSupport::JSON.decode(json)
        end
      #rescue
      #  Rails.logger.debug("YouTube not reachable @ #{url}.")
      #  config['video_id'] = ''
      #  return
      #end
      if data.empty?
        Rails.logger.debug('No video found from ' + url)
        self.config['video_id'] = ''
        return
      end
      video_data = data[0]
      # some vimeo videos have zero for their duration, so in that case use what the user supplied
      self.duration = (video_data['duration'].to_i > 0 ? video_data['duration'].to_i : self.duration.to_i)
      self.config['thumb_url'] = video_data['thumbnail_small']
      self.config['title'] = video_data['title']
      self.config['description'] = video_data['description']
    end
  end

  # Build a URL for an iframe player.
  def player_url(params={})
    url = VIDEO_VENDORS[self.config['video_vendor'].to_sym][:url] + self.config['video_id']
    if self.config['allow_flash'] == '0'
      params['html5'] = 1
    end
    url += '?' + URI.escape(params.collect{|k,v| "#{k}=#{v}"}.join('&'))
    return url
  end

  def video_id_must_exist
    if config['video_id'].empty?
      errors.add(:video_id, 'could not be found')
    end
  end

  def video_vendor_supported
    if config['video_vendor'].empty? || !VIDEO_VENDORS.collect { |a,b| b[:id] }.include?(config['video_vendor'])
      errors.add(:video_vendor, 'must be ' + VIDEO_VENDORS.collect { |a,b| b[:id] }.join(" or "))
    end
  end

  def render_details
    if self.config['video_vendor'] == VIDEO_VENDORS[:YouTube][:id]
      settings = {
        :autoplay => 1,  # Autostart the video
        :end => self.duration,  # Stop it around the duration
        :controls => 0,  # Don't show any controls
        :modestbranding => 1,  # Use the less fancy branding
        :rel => 0,  # Don't show related videos
        :showinfo => 0,  # Don't show the video info
        :iv_load_policy => 3  # Don't show any of those in-video labels
      }
    elsif self.config['video_vendor'] == VIDEO_VENDORS[:Vimeo][:id]
      settings = {
        :api => 1,  # use Javascript API
        :player_id => 'playerv', #arbitrary id of iframe 
        :byline => 0,
        :portrait => 0,
        :autoplay => 1
      }
    end
    {:path => player_url(settings)}
  end
end
