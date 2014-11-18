# encoding: utf-8
#
# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

module RedmineTinyMce
  module Hooks
    # Project hook for add select to choice wiki/issue editor!
    class ProjectSettingsHook < Redmine::Hook::ViewListener
      def view_projects_form(context = {})
        context[:controller].send(
          :render_to_string,
          partial: 'projects/tiny_mce_formatting',
          locals: context
        )
      end
    end
  end
end
