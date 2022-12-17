# frozen_string_literal: true

require_relative "chamber"
require_relative "shape"

input = File.readlines("input.txt", chomp: true)

jet_pattern = input[0].split("").map { |x| x == "<" ? :left : :right }

shapes = [
  Shape.new([
    [:rock, :rock, :rock, :rock],
  ]),
  Shape.new([
    [:empty, :rock, :empty],
    [:rock, :rock, :rock],
    [:empty, :rock, :empty],
  ]),
  Shape.new([
    [:empty, :empty, :rock],
    [:empty, :empty, :rock],
    [:rock, :rock, :rock],
  ]),
  Shape.new([
    [:rock],
    [:rock],
    [:rock],
    [:rock],
  ]),
  Shape.new([
    [:rock, :rock],
    [:rock, :rock],
  ]),
]

chamber = Chamber.new(width: 7, shapes: shapes, jet_pattern: jet_pattern)
puts "part 1: #{chamber.drop(2022)}"

chamber = Chamber.new(width: 7, shapes: shapes, jet_pattern: jet_pattern)
puts "part 2: #{chamber.drop_many(1000000000000)}"
