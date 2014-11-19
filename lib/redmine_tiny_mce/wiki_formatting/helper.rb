module RedmineTinyMce
  module WikiFormatting
    # TinyMCE helper for formatting
    module Helper
      def wikitoolbar_for(field_id)
        heads_for_wiki_formatter
        javascript_tag <<-EOT
          $(document).ready(function() {
            new TINY.editor.edit('editor', {
              id: '#{field_id}',
              width:584,
              height:175,
              cssclass:'te',
              controlclass:'tecontrol',
              rowclass:'teheader',
              dividerclass:'tedivider',
              controls:['bold','italic','underline','strikethrough','|','subscript','superscript','|',
                    'orderedlist','unorderedlist','|','outdent','indent','|','leftalign',
                    'centeralign','rightalign','blockjustify','|','unformat','|','undo','redo','n',
                    'font','size','style','|','image','hr','link','unlink','|','cut','copy','paste','print'],
              footer:true,
              fonts:['Verdana','Arial','Georgia','Trebuchet MS'],
              xhtml:true,
              bodyid:'editor',
              footerclass:'tefooter',
              toggle:{text:'show source',activetext:'show wysiwyg',cssclass:'toggle'},
              resize:{cssclass:'resize'}
            });
          });
        EOT
      end

      def heads_for_wiki_formatter
        unless @heads_for_wiki_formatter_included
          content_for :header_tags do
            javascript_include_tag('tinyeditor.js', plugin: 'redmine_tiny_mce') +
            stylesheet_link_tag('tinyeditor.css', plugin: 'redmine_tiny_mce')
          end
          @heads_for_wiki_formatter_included = true
        end
      end
    end
  end
end