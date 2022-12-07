# frozen_string_literal: true

module Day7
  class DebugVisitor
    def initialize
      @indent = 0
    end

    def visit_directory(directory)
      puts "#{" " * (@indent * 2)}#{directory.name} #{directory.size}"
      @indent += 1
      directory.directories.each do |child|
        child.accept(self)
      end
      directory.files.each do |file|
        file.accept(self)
      end
      @indent -= 1
    end

    def visit_file(file)
      puts "#{" " * (@indent * 2)}#{file.name} #{file.size}"
    end
  end
end
