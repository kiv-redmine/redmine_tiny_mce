# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

module RedmineTinyMce
  module Patches
    # Patch for project to add editor option
    module ApplicationHelperPatch
      def self.included(base)
        base.send(:include, InstanceMethods)
        base.class_eval do
          # Patch wiki_helper (all helpers are delegateted)
          # Just try if project is available
          alias_method_chain :wiki_helper, :project
        end
      end

      module InstanceMethods
        def wiki_helper_with_project
          if @project
            helper = Redmine::WikiFormatting.helper_for(@project.editor)
            extend helper
            return self
          else
            wiki_helper_without_project
          end
        end
      end
    end
  end
end
