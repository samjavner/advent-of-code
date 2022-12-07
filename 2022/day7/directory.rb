# frozen_string_literal: true

require "./size_visitor"

module Day7
  class Directory
    attr_reader :name, :parent, :directories, :files

    def initialize(name, parent)
      @name = name
      @parent = parent
      @directories = []
      @files = []
    end

    def accept(visitor)
      visitor.visit_directory(self)
    end

    def size
      size_visitor = SizeVisitor.new
      accept(size_visitor)
      size_visitor.size
    end
  end
end
