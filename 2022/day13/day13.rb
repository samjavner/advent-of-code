# frozen_string_literal: true

require "json"

input = File.readlines("input.txt", chomp: true)

input1 = input
  .slice_after(&:empty?)
  .map { |a, b| [JSON.parse(a), JSON.parse(b)] }

def compare(a, b)
  if a.is_a?(Array) && b.is_a?(Array)
    return 0 if a.empty? && b.empty?
    return -1 if a.empty?
    return 1 if b.empty?

    a1, *a = a
    b1, *b = b
    c = compare(a1, b1)
    c != 0 ? c : compare(a, b)
  elsif a.is_a?(Array)
    compare(a, [b])
  elsif b.is_a?(Array)
    compare([a], b)
  else
    a <=> b
  end
end

part1 = input1.each_with_index.map do |pair, index|
  a, b = pair
  compare(a, b) == 1 ? 0 : index + 1
end.sum

puts "part 1: #{part1}"

divider1 = [[2]]
divider2 = [[6]]

input2 = input1.flatten(1)
input2.push(divider1)
input2.push(divider2)

input2.sort! { |a, b| compare(a, b) }
part2 = (input2.find_index(divider1) + 1) * (input2.find_index(divider2) + 1)

puts "part 2: #{part2}"
