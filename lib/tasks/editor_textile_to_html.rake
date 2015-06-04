namespace :redmine_tiny_mce do
  desc "Compile specific project to HTML for using CKEDITOR, this operation is permitted and cannot be rollback!"
  task :compile_to_html => :environment do
    project_name = ENV['REDMINE_PROJECT']

    unless project_name
      fail "PROJECT name missing, please run RAILS_ENV=production REDMINE_PROJECT=test rake redmine_tiny_mce:compile_to_html"
    end

    # Search project
    project = Project.find project_name

    # Ask (just for sure)
    puts "Do you want to migrate project '#{project_name}' and all associated items to HTML? (type 'y' to continue): "
    unless STDIN.gets.chomp == 'y'
      puts "Cancelled"
    else
      start(project)
    end
  end

  def start(project)
    puts "project #{project.name}"
    project.description = format(project.description)
    project.save!
    migrate(:issues, project.issues, :description)
    migrate(:journals, Journal.where(:journalized_type => "Issue", :journalized_id => project.issues), :notes)
    migrate(:documents, project.documents, :description)
    migrate(:messages, Message.where(:board_id => project.boards), :content)
    migrate(:news, project.news, :description)
    migrate(:comments, Comment.where(:commented_type => "News", :commented_id => project.news), :comments)
    migrate(:wiki, WikiContent.where(:page_id => project.wiki.pages), :text) if project.wiki
  end

  def migrate(type, records, column)
    n = records.count
    return if n == 0
    records.each_with_index do |record, i|
        print "\rMigrating #{type} ... (#{i}/#{n})"
        record.send("#{column.to_s}=", format(record.send(column)))
      begin
        record.save!
      rescue Exception => e
        puts("[ERROR] #{e.message} in migrating #{type} for #{column} in #{record}")
      end
    end

    puts "\rMigrating #{type} ... done                             "
  end

  def format(text)
    text.gsub!('> *','*') unless text.nil?
    text.gsub!('{{thumb(','{{thumbnail(') unless text.nil?
    options = [:no_span_caps]
    text && RedCloth.new(text,options).to_html
  end
end
