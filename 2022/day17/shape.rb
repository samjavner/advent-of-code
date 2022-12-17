# frozen_string_literal: true

class Shape
  def initialize(shape)
    @positions = []
    shape.reverse.each_with_index do |row_contents, row|
      row_contents.each_with_index do |col_contents, col|
        @positions.push([row, col]) if col_contents == :rock
      end
    end
  end

  def positions(row, col)
    @positions.map { |r, c| [row + r, col + c] }
  end
end
