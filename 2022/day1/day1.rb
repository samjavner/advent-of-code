# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

elf_calories = input
  .chunk(&:empty?)
  .reject { |x| x[0] }
  .map(&:last)
  .map { |x| x.map(&:to_i) }
  .map(&:sum)

max_total_calories = elf_calories.max

puts "part 1: #{max_total_calories}"

total_top_three_calories = elf_calories.sort { |a, b| b <=> a }
  .first(3)
  .sum

puts "part 2: #{total_top_three_calories}"
