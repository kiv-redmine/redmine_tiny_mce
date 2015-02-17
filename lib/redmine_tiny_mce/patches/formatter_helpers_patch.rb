# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

module RedmineTinyMce
  module Patches
    # Patch for project to add editor option
    module FormatterHelpersPatch
      def self.included(base)
        base.class_eval do
          # Has default editor
          module_function :heads_for_wiki_formatter, :wikitoolbar_for
        end
      end
    end
  end
end
