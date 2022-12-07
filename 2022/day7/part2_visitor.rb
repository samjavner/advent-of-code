# frozen_string_literal: true

module Day7
  class Part2Visitor
    attr_reader :answer

    def initialize(root)
      @space_needed = 30000000 - (70000000 - root.size)
      @answer = nil
    end

    def visit_directory(directory)
      if directory.size >= @space_needed
        @answer = if @answer.nil?
          directory.size
        else
          [@answer, directory.size].min
        end
      end

      directory.directories.each do |child|
        child.accept(self)
      end
    end

    def visit_file(file)
    end
  end
end
