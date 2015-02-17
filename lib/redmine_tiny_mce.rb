# encoding: utf-8
#
# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>

module RedmineTinyMce
  class << self
    def allowed_tags
      @allowed_tags ||= %w[
        a abbr acronym address blockquote b big br caption cite code dd del dfn
        div dt em h1 h2 h3 h4 h5 h6 hr i img ins kbd li ol p pre samp small span
        strike s strong sub sup table tbody td tfoot th thead tr tt u ul var iframe
      ]
    end

    def allowed_attributes
      @allowed_attributes ||= %w[
        href src width height alt cite datetime title class name xml:lang abbr dir
        style align valign border cellpadding cellspacing colspan rowspan nowrap
        start reversed
      ]
    end
  end
end
