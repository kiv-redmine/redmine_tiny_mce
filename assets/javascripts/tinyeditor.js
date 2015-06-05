var TinyEditor = {};
(function () {
    "use strict";
    var isIE = !!document.all;

    var cursorTop = function (e) {
        return (isIE ? window.event.clientY + document.documentElement.scrollTop
            + document.body.scrollTop : e.clientY + window.scrollY);
    };

    var c = {
        bold: [4, 'Bold', 'a', 'bold'],
        blockjustify: [17, 'Block Justify', 'a', 'justifyfull'],
        centeralign: [15, 'Center Align', 'a', 'justifycenter'],
        copy: [2, 'Copy', 'a', 'copy', 1],
        cut: [1, 'Cut', 'a', 'cut', 1],
        hr: [21, 'Insert Horizontal Rule', 'a', 'inserthorizontalrule'],
        image: [20, 'Insert Image', 'i', 'insertimage', 'Enter Image URL:', 'http://'],
        indent: [13, 'Indent', 'a', 'indent'],
        italic: [5, 'Italic', 'a', 'italic'],
        leftalign: [14, 'Left Align', 'a', 'justifyleft'],
        link: [22, 'Insert Hyperlink', 'i', 'createlink', 'Enter URL:', 'http://'],
        orderedlist: [10, 'Insert Ordered List', 'a', 'insertorderedlist'],
        outdent: [12, 'Outdent', 'a', 'outdent'],
        paste: [3, 'Paste', 'a', 'paste', 1],
        print: [25, 'Print', 'a', 'print'],
        redo: [19, 'Redo', 'a', 'redo'],
        rightalign: [16, 'Right Align', 'a', 'justifyright'],
        strikethrough: [7, 'Strikethrough', 'a', 'strikethrough'],
        subscript: [8, 'Subscript', 'a', 'subscript'],
        superscript: [9, 'Superscript', 'a', 'superscript'],
        underline: [6, 'Underline', 'a', 'underline'],
        undo: [18, 'Undo', 'a', 'undo'],
        unorderedlist: [11, 'Insert Unordered List', 'a', 'insertunorderedlist'],
        unformat: [24, 'Remove Formatting', 'a', 'removeformat'],
        unlink: [23, 'Remove Hyperlink', 'a', 'unlink'],

        // This is only for edit wiki
        comments:   [ 26, 'Comments', 'insertHtml', '{{comments}}{{comment_form}}' ],
        page:       [ 27, 'Page', 'addWikiLink' ],
        attachment: [ 28, 'Attachment', 'addAttachment' ]
    },
    offset = -30;

    var edit = function (el, opt) {
        var t = this,
            id,
            d,
            div,
            fl,
            font,
            fonts,
            pos,
            sel,
            size,
            sizes,
            style,
            styles,
            sl,
            x,
            p = document.createElement('div'),
            w = document.createElement('div'),
            h = document.createElement('div'),
            l = opt.controls.length,
            i = 0;

        //protected functions
        var onClick = function (id, x) {
            if (id === 'print') {
                return function () {
                    t.print();
                };
            }
            if (x[2] === "a") {
                return function () {
                    t.action(x[3], 0, x[4] || 0);
                };
            }
            if (x[2] === 'insertHtml') {
              return function() {
                t.insertHtml(x[3]);
              };
            }

            if (x[2] === 'addAttachment') {
              return function() {
                t.addAttachment();
              };
            }

            if (x[2] === 'addWikiLink') {
              return function() {
                t.addWikiLink();
              };
            }

            return function () {
                t.insert(x[4], x[5], x[3]);
            };
        },
            onMouseOver = function (pos) {
                return function () {
                    t.hover(this, pos, 1);
                };
            },
            onMouseOut = function (pos) {
                return function () {
                    t.hover(this, pos, 0);
                };
            },
            onChangeFormatBlock = function () {
                t.ddaction(this, "formatblock");
            },
            onChangeFontName = function () {
                t.ddaction(this, "fontname");
            },
            onChangeFontSize = function () {
                t.ddaction(this, "fontsize");
            },
            onBlur = function () {
                return function () {
                    t.el.value = t.e.body.innerHTML;
                };
            };
        this.el = el;
        this.opt = opt;
        this.iframe = document.createElement('iframe');
        this.iframe.frameBorder = 0;

        this.iframe.width = opt.width || '500';
        this.iframe.height = opt.height || '250';
        this.ie = isIE;
        h.className = opt.rowclass || 'teheader';
        p.className = opt.cssclass || 'te';
        p.style.maxWidth = this.iframe.width + 'px';
        p.appendChild(h);
        for (i; i < l; i += 1) {
            id = opt.controls[i];
            if (id === 'n') {
                h = document.createElement('div');
                h.className = opt.rowclass || 'teheader';
                p.appendChild(h);
            } else if (id === '|') {
                d = document.createElement('div');
                d.className = opt.dividerclass || 'tedivider';
                h.appendChild(d);
            } else if (id === 'font') {
                sel = document.createElement('select');
                fonts = opt.fonts || ['Verdana', 'Arial', 'Georgia'];
                fl = fonts.length;
                x = 0;
                sel.className = 'tefont';
                sel.onchange = onChangeFontName;
                sel.options[0] = new Option('Font', '');
                for (x; x < fl; x += 1) {
                    font = fonts[x];
                    sel.options[x + 1] = new Option(font, font);
                }
                h.appendChild(sel);
            } else if (id === 'size') {
                sel = document.createElement('select');
                sizes = opt.sizes || [1, 2, 3, 4, 5, 6, 7];
                sl = sizes.length;
                x = 0;
                sel.className = 'tesize';
                sel.onchange = onChangeFontSize;
                for (x; x < sl; x += 1) {
                    size = sizes[x];
                    sel.options[x] = new Option(size, size);
                }
                h.appendChild(sel);
            } else if (id === 'style') {
                sel = document.createElement('select');
                styles = opt.styles || [['Style', ''], ['Paragraph', '<p>'], ['Header 1', '<h1>'], ['Header 2', '<h2>'], ['Header 3', '<h3>'], ['Header 4', '<h4>'], ['Header 5', '<h5>'], ['Header 6', '<h6>']];
                sl = styles.length;
                x = 0;
                sel.className = 'testyle';
                sel.onchange = onChangeFormatBlock;
                for (x; x < sl; x += 1) {
                    style = styles[x];
                    sel.options[x] = new Option(style[0], style[1]);
                }
                h.appendChild(sel);
            } else if (c[id] && ((c[id][0] >= 26 && window.editWiki) || (c[id][0] < 26))) {
                div = document.createElement('div');
                x = c[id];
                pos = x[0] * offset;
                div.className = opt.controlclass;
                div.style.backgroundPosition = '0px ' + pos + 'px';
                div.title = x[1];
                div.onclick = onClick(id, x);
                div.onmouseover = onMouseOver(pos);
                div.onmouseout = onMouseOut(pos);
                h.appendChild(div);
                if (this.ie) {
                    div.unselectable = 'on';
                }
            }
        }
        this.el.parentNode.insertBefore(p, this.el);
        this.el.style.width = this.iframe.width + 'px';
        w.appendChild(this.el);
        w.appendChild(this.iframe);
        p.appendChild(w);
        this.el.style.display = 'none';
        if (opt.footer) {
            var f = document.createElement('div');
            f.className = opt.footerclass || 'tefooter';
            if (opt.toggle) {
                var to = opt.toggle, ts = document.createElement('div');
                ts.className = to.cssclass || 'toggle';
                ts.innerHTML = to.text || 'source';
                ts.onclick = function () {
                    t.toggle(0, this);
                    return false;
                };
                f.appendChild(ts);
            }
            if (opt.resize) {
                var ro = opt.resize, rs = document.createElement('div');
                rs.className = ro.cssclass || 'resize';
                rs.onmousedown = function (event) {
                    t.resize(event);
                    return false;
                };
                rs.onselectstart = function () {
                    return false;
                };
                f.appendChild(rs);
            }
            p.appendChild(f);
        }
        this.e = this.iframe.contentWindow.document;
        this.e.open();
        var iHTML = '<html><head>',
            bodyid = opt.bodyid ? " id=\"" + opt.bodyid + "\"" : "";
        if (opt.cssfile) {
            iHTML += '<link rel="stylesheet" href="' + opt.cssfile + '" />';
        }
        if (opt.css) {
            iHTML += '<style type="text/css">' + opt.css + '</style>';
        }
        iHTML += '</head><body' + bodyid + '>' + (opt.content || this.el.value);
        iHTML += '</body></html>';

        if (this.iframe.attachEvent) {
            this.iframe.attachEvent('onblur', onBlur());
        } else if (this.iframe.contentDocument.addEventListener) {
            this.iframe.contentDocument.addEventListener('blur', onBlur(), true);
        }
        this.e.write(iHTML);
        this.e.close();
        this.e.designMode = 'on';
        this.d = 1;
        if (this.xhtml) {
            try {
                this.e.execCommand("styleWithCSS", 0, 0);
            } catch (e) {
                try {
                    this.e.execCommand("useCSS", 0, 1);
                } catch (e1) {
                    console.log(e1);
                }
            }
        }
    };
    edit.prototype.print = function () {
        this.iframe.contentWindow.print();
    };
    edit.prototype.hover = function (div, pos, dir) {
        div.style.backgroundPosition = (dir ? '34px' : '0px') + " " + pos + 'px';
    };
    edit.prototype.ddaction = function (dd, a) {
        this.action(a, dd.options[dd.selectedIndex].value);
    };
    edit.prototype.action = function (cmd, val, ie) {
        if (ie && !this.ie) {
            alert('Your browser does not support this function.');
        } else {
            this.e.execCommand(cmd, 0, val || null);
            this.el.value = this.e.body.innerHTML;
        }
    };
    edit.prototype.insert = function (pro, msg, cmd) {
        var val = window.prompt(pro, msg);
        if (val !== null && val !== '') {
            this.e.execCommand(cmd, 0, val);
        }
    };
    edit.prototype.addWikiLink = function() {
      /** Show ajax modal with selection of attachments */
      var html = $('<ul/>');
      var that = this;
      var length = window.wikiPages.length;

      for (var index = 0; index < length; index++) {
        var li = $('<li/>');
        var a  = $('<a/>').attr('href', '#');
        var file = window.wikiPages[index];
        a.html(file);
        a.on('click', function(evt) {
          evt.preventDefault();
          that.e.execCommand('insertText', 0, '[[' + $(this).html() + ']] ');
          that.el.value = that.e.body.innerHTML;
          hideModal();
        });
        li.append(a);
        html.append(li);
      }

      html.prepend('<h3 class="title">' + window.wikipageTitle + '</h3>');
      $('#ajax-modal').html(html).promise().done(function() {
        showModal('ajax-modal', '400px');
      });
    };
    edit.prototype.addAttachment = function() {
      /** Show ajax modal with selection of attachments */
      var html = $('<ul/>');
      var that = this;

      $('.icon-attachment').each(function() {
        var li = $('<li/>');
        var a  = $('<a/>').attr('href', '#');
        var file = $(this).html();
        a.html(file);
        a.on('click', function(evt) {
          evt.preventDefault();
          that.e.execCommand('insertText', 0, 'attachment:' + file);
          that.el.value = that.e.body.innerHTML;
          hideModal();
        });
        li.append(a);
        html.append(li);
      });

      html.prepend('<h3 class="title">' + window.attachmentTitle + '</h3>');
      $('#ajax-modal').html(html).promise().done(function() {
        showModal('ajax-modal', '400px');
      });
    };
    edit.prototype.insertHtml = function (val) {
      if (this.ie) {
        alert('Your browser does not support this function.');
      } else {
        this.e.execCommand('insertText', 0, val || null);
        this.el.value = this.e.body.innerHTML;
      }
    };
    edit.prototype.setfont = function () {
        this.e.execCommand('formatblock', 0);
    };
    edit.prototype.resize = function (e) {
        var t = this;
        if (this.mv) {
            this.freeze();
        }
        this.iframe.bcs = cursorTop(e);
        this.mv = function (event) {
            t.move(event);
        };
        this.sr = function () {
            t.freeze();
        };
        if (this.ie) {
            document.attachEvent('onmousemove', this.mv);
            document.attachEvent('onmouseup', this.sr);
        } else {
            document.addEventListener('mousemove', this.mv, 1);
            document.addEventListener('mouseup', this.sr, 1);
        }
    };
    edit.prototype.move = function (e) {
        var pos = cursorTop(e);
        this.iframe.height = parseInt(this.iframe.height, 10) + pos - this.iframe.bcs;
        this.iframe.bcs = pos;
    };
    edit.prototype.freeze = function () {
        if (this.ie) {
            document.detachEvent('onmousemove', this.mv);
            document.detachEvent('onmouseup', this.sr);
        } else {
            document.removeEventListener('mousemove', this.mv, 1);
            document.removeEventListener('mouseup', this.sr, 1);
        }
    };
    edit.prototype.toggle = function (post, div) {
        var v;
        if (!this.d) {
            v = this.el.value;
            if (div) {
                div.innerHTML = this.opt.toggle.text || 'source';
            }
            this.e.body.innerHTML = v;
            this.el.style.display = 'none';
            this.iframe.style.display = 'block';
            this.d = 1;
        } else {
            v = this.e.body.innerHTML;
            if (div) {
                div.innerHTML = this.opt.toggle.activetext || 'wysiwyg';
            }
            this.el.value = v;
            if (!post) {
                this.el.style.height = this.iframe.height + 'px';
                this.iframe.style.display = 'none';
                this.el.style.display = 'block';
                this.d = 0;
            }
        }
    };
    edit.prototype.post = function () {
        if (this.d) {
            this.toggle(1);
        }
    };
    TinyEditor = function (opt) {
        var t = this;
        this.editors = [];
        Array.prototype.forEach.call(
        document.querySelectorAll(opt.el),
            function (el) {
                t.editors.push( new edit(el, opt));
            });
    };
}());
