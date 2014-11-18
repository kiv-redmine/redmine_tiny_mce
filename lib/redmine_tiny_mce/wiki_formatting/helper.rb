module RedmineTinyMce
  module WikiFormatting
    # TinyMCE helper for formatting
    module Helper
      def replace_editor_tag(field_id)
        javascript_tag <<-EOT
          $(document).ready(function() {
            new TINY.editor.edit('editor', {
              id: '#{field_id}'
            });
          });
        EOT
      end
    end
  end
end
