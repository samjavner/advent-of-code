# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

def fully_contains?((a1, a2), (b1, b2))
  a1 <= b1 && a2 >= b2
end

assignment_pairs = input
  .map { |x| x.split(",") }
  .map do |a, b|
  [
    a.split("-").map(&:to_i),
    b.split("-").map(&:to_i),
  ]
end

fully_containing_pairs = assignment_pairs.select { |a, b| fully_contains?(a, b) || fully_contains?(b, a) }

puts "part 1: #{fully_containing_pairs.length}"

def overlaps?((a1, a2), (b1, b2))
  a1 <= b2 && b1 <= a2
end

overlapping_pairs = assignment_pairs.select { |a, b| overlaps?(a, b) }

puts "part 2: #{overlapping_pairs.length}"
