module RedmineTinyMce
  module Hooks
    class ViewWikiFormBottom < Redmine::Hook::ViewListener
      def view_wiki_form_bottom(context={})
        return context[:controller].send(:render_to_string, {
          :partial => 'wiki/edit_form_bottom',
          :locals => {
            :project => context[:project],
            :f       => context[:form],
            :page    => context[:page]
          }
        })
      end
    end
  end
end
