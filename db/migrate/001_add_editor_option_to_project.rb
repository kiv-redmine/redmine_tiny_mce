# encoding: utf-8
#
# This file is a part of Redmine TinyMce editor plugin
#
# @author Strnadj <jan.strnadek@gmail.com>
# Add editor option to project!
class AddEditorOptionToProject < ActiveRecord::Migration
  def change
    add_column :projects, :editor, :string, default: 'textile'
  end
end
