module RedmineTinyMce
  module WikiFormatting
    class Formatter
      include ActionView::Helpers::TagHelper
      include ActionView::Helpers::TextHelper
      include ActionView::Helpers::UrlHelper
      include Redmine::WikiFormatting::LinksHelper

      def initialize(text)
        @text = text
      end

      def to_html(&block)
        auto_link!(@text)
        ActionView::Base.white_list_sanitizer.sanitize(@text,
          :tags => RedmineTinyMce.allowed_tags,
          :attributes => RedmineTinyMce.allowed_attributes
        ).gsub(/<pre>\s*<code\s+(?:class="(\w+)")>[\r\n]*([^<]*?)[\r\n]*<\/code>\s*<\/pre>/) {
          lang, code = $~.captures
          %Q[<pre>\n<code class="#{lang} syntaxhl">#{
            Redmine::SyntaxHighlighting.highlight_by_language(code, lang)
          }</code>\n</pre>]
        }.gsub(/\{\{(.*?)\}\}/) {
          "{{" + CGI.unescapeHTML($1) + "}}"
        }
      end
    end
  end
end
