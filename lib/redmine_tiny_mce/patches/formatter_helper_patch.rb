module RedmineTinyMce
  module Patches
    module FormatterHelperPatch
      def self.included(base)
        base.class_eval do
          unloadable
          base.send(:include, InstanceMethods)
          alias_method_chain :heads_for_wiki_formatter, :extras
        end
      end

      module InstanceMethods
        def heads_for_wiki_formatter_with_extras
          value = @heads_for_wiki_formatter_with_extras
          heads_for_wiki_formatter_without_extras
          if !value && params[:action] == 'edit' && params[:controller] == 'wiki'
            content_for :header_tags do
              javascript_include_tag('toolbar.ext.js', :plugin => :redmine_tiny_mce) +
              stylesheet_link_tag('toolbar.ext.css', :plugin => :redmine_tiny_mce)
            end
          end
        end
      end
    end
  end
end
