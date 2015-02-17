module RedmineTinyMce
  module WikiFormatting
    class Formatter
      include ActionView::Helpers::TagHelper
      include ActionView::Helpers::TextHelper
      include ActionView::Helpers::UrlHelper
      include Redmine::WikiFormatting::LinksHelper
    end
  end
end
