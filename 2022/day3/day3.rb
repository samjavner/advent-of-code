# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

# Lowercase item types a through z have priorities 1 through 26.
# Uppercase item types A through Z have priorities 27 through 52.
def get_priority(item_type)
  code = item_type.ord
  is_upper = code < 96
  is_upper ? code - 64 + 26 : code - 96
end

rucksacks = input.map { |x| x.split("") }
compartmented_rucksacks = rucksacks.map do |x|
  length = x.length / 2
  [x.slice(0, length), x.slice(length, length)]
end

shared_item_types = compartmented_rucksacks.map { |c1, c2| c1.intersection(c2).first }
p1_priorities = shared_item_types.map { |i| get_priority(i) }

puts "part 1: #{p1_priorities.sum}"

groups = rucksacks.each_slice(3)
badge_item_types = groups.map { |r1, r2, r3| r1.intersection(r2).intersection(r3).first }
p2_priorities = badge_item_types.map { |i| get_priority(i) }

puts "part 2: #{p2_priorities.sum}"
