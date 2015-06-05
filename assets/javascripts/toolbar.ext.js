jsToolBar.prototype.elements.addAttachment = {
  type: 'button',
  title: 'Add files',
  fn: {
    wiki: function() {
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
          that.encloseLineSelection('', 'attachment:' + file);
          hideModal();
        });
        li.append(a);
        html.append(li);
      });

      html.prepend('<h3 class="title">' + window.attachmentTitle + '</h3>');
      $('#ajax-modal').html(html).promise().done(function() {
        showModal('ajax-modal', '400px');
      });
    }
  }
};

jsToolBar.prototype.elements.addWikiLink = {
  type: 'button',
  title: 'Add wiki link',
  fn: {
    wiki: function() {
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
          that.encloseLineSelection('', '[[' + $(this).html() + ']]');
          hideModal();
        });

        li.append(a);
        html.append(li);
      }

      html.prepend('<h3 class="title">' + window.wikipageTitle + '</h3>');
      $('#ajax-modal').html(html).promise().done(function() {
        showModal('ajax-modal', '400px');
      });
    }
  }
};

jsToolBar.prototype.elements.addComment = {
  type: 'button',
  title: 'Add comment',
  fn: {
    wiki: function() {
      this.encloseLineSelection('', '{{comments}}{{comment_form}}');
    }
  }
};
