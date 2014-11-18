# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

Redmine::Plugin.register :redmine_tiny_mce do
  name 'Redmine TinyMce plugin'
  author 'Strnadj <jan.strnadek@gamil.com>'
  description 'This plugin is usefull to switch markdown editor to WYSIWYG in specific projects'
  version '0.0.1'

  # Prerequisites
  requires_redmine version_or_higher: '2.4'
end

require 'redmine_tiny_mce'
