# encoding: utf-8
#
# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

require 'redmine'

ActionDispatch::Reloader.to_prepare do
  require_dependency 'project'

  unless Project.included_modules.include?(RedmineTinyMce::Patches::ProjectPatch)
    Project.send(:include, RedmineTinyMce::Patches::ProjectPatch)
  end
end

Redmine::Plugin.register :redmine_tiny_mce do
  name 'Redmine TinyMce plugin'
  author 'Strnadj <jan.strnadek@gamil.com>'
  description 'Switch markdown editor to WYSIWYG in specific projects'
  version '0.0.1'
  url 'https://github.com/Strnadj/redmine_tiny_mce'

  # Prerequisites
  requires_redmine version_or_higher: '2.4'

  # Wiki format provider
  wiki_format_provider 'TinyMce', RedmineTinyMce::WikiFormatting::Formatter, RedmineTinyMce::WikiFormatting::Helper
end

require 'redmine_tiny_mce'
