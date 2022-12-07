# frozen_string_literal: true

module Day7
  class File
    attr_reader :name, :size

    def initialize(name, size)
      @name = name
      @size = size
    end

    def accept(visitor)
      visitor.visit_file(self)
    end
  end
end
