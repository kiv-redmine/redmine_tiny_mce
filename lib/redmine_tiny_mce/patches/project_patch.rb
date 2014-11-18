# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

module RedmineTinyMce
  module Patches
    # Patch for project to add editor option
    module ProjectPatch
      def self.included(base)
        base.class_eval do
          # Has default editor
          safe_attributes :editor
        end
      end
    end
  end
end
