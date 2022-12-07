# frozen_string_literal: true

module Day7
  class Part1Visitor
    attr_reader :answer

    def initialize
      @answer = 0
    end

    def visit_directory(directory)
      if directory.size <= 100000
        @answer += directory.size
      end

      directory.directories.each do |child|
        child.accept(self)
      end
    end

    def visit_file(file)
    end
  end
end
