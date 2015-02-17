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

          # Remove methods for wiki
          remove_method :wikitoolbar_for
          remove_method :heads_for_wiki_formatter
        end
      end

      module InstanceMethods
        def wiki_helper_with_project
          byebug
          if @project
            Redmine::WikiFormatting.helper_for(@project.editor)
          else
            wiki_helper_without_project
          end
        end

        def wikitoolbar_for(field_id)
          wiki_helper.wikitoolbar_for field_id
        end

        def heads_for_wiki_formatter
          wiki_helper.heads_for_wiki_formatter
        end
      end
    end
  end
end
