# encoding: utf-8
#
# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

require 'redmine'

ActionDispatch::Reloader.to_prepare do
  require_dependency 'project'
  require_dependency 'application_helper'
  require_dependency 'redmine/wiki_formatting'
  require_dependency 'redmine/wiki_formatting/markdown/helper'
  require_dependency 'redmine/wiki_formatting/textile/helper'

  unless Project.included_modules.include?(RedmineTinyMce::Patches::ProjectPatch)
    Project.send(:include, RedmineTinyMce::Patches::ProjectPatch)
  end

  unless ApplicationHelper.included_modules.include?(RedmineTinyMce::Patches::ApplicationHelperPatch)
    ApplicationHelper.send(:include, RedmineTinyMce::Patches::ApplicationHelperPatch)
  end

  unless Redmine::WikiFormatting::Markdown::Helper.included_modules.include?(RedmineTinyMce::Patches::FormatterHelpersPatch)
    Redmine::WikiFormatting::Markdown::Helper.send(:include, RedmineTinyMce::Patches::FormatterHelpersPatch)
  end

  unless Redmine::WikiFormatting::Textile::Helper.included_modules.include?(RedmineTinyMce::Patches::FormatterHelpersPatch)
    Redmine::WikiFormatting::Textile::Helper.send(:include, RedmineTinyMce::Patches::FormatterHelpersPatch)
  end

  unless Redmine::WikiFormatting::NullFormatter::Helper.included_modules.include?(RedmineTinyMce::Patches::FormatterHelpersPatch)
    Redmine::WikiFormatting::NullFormatter::Helper.send(:include, RedmineTinyMce::Patches::FormatterHelpersPatch)
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
  wiki_format_provider 'tinymce', RedmineTinyMce::WikiFormatting::Formatter, RedmineTinyMce::WikiFormatting::Helper
  puts "#{Redmine::WikiFormatting.formatters.freeze}\n"
end

require 'redmine_tiny_mce'
