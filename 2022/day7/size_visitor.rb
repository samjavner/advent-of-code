# frozen_string_literal: true

module Day7
  class SizeVisitor
    attr_reader :size

    def initialize
      @size = 0
    end

    def visit_directory(directory)
      directory.directories.each do |child|
        child.accept(self)
      end

      directory.files.each do |file|
        file.accept(self)
      end
    end

    def visit_file(file)
      @size += file.size
    end
  end
end
