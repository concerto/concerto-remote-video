$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "concerto_remote_video/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "concerto_remote_video"
  s.version     = ConcertoRemoteVideo::VERSION
  s.authors     = ["Brian Michalski"]
  s.email       = ["bmichalski@gmail.com"]
  s.homepage    = "https://github.com/concerto/concerto-remote-video"
  s.summary     = "Remotely hosted video for Concerto 2"
  s.description = "Adds support for remotely hosted videos, like YouTube or vimeo, in Concerto 2"

  s.files = Dir["{app,config,db,lib,public}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2"

  s.add_development_dependency "sqlite3"
end
