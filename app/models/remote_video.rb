class RemoteVideo < Content
  after_initialize :set_kind, :create_config, :load_info

  after_find :load_config
  before_validation :save_config

  validate :video_id_must_exist
  validates :duration, :numericality => { :greater_than => 0 }

  DISPLAY_NAME = 'YouTube Video'

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
    attributes.concat([:config => [:video_id, :allow_flash]])
  end

  # Load some info about this video from YouTube.
  def load_info
    return if self.config['video_id'].nil? || !self.duration.nil?
    require 'net/http'
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
  end

  # Build a URL for an iframe player.
  def player_url(params={})
    url = "https://www.youtube.com/embed/#{self.config['video_id']}"
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
end
