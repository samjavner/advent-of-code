# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

program = input.map(&:split)

current_cycle = 1
current_x = 1
x_values = [[0, 0]]

program.each do |instruction, *operands|
  if instruction == "noop"
    current_cycle += 1
  elsif instruction == "addx"
    current_cycle += 2
    current_x += operands[0].to_i
    x_values.push([current_cycle, current_x])
  end
end

get_x_value = ->(cycle) do
  index = x_values.find_index { |c, _x| c > cycle }
  index == 0 ? 1 : x_values[index - 1][1]
end

get_signal_strength = ->(cycle) do
  get_x_value.call(cycle) * cycle
end

part1 = [20, 60, 100, 140, 180, 220].map { |cycle| get_signal_strength.call(cycle) }.sum

puts "part 1: #{part1}"

crt = Array.new(6) { Array.new(40, "-") }

draw = ->(cycle, x) do
  row = (cycle - 1) / 40
  col = (cycle - 1) % 40
  pixel = [col - 1, col, col + 1].include?(x) ? "#" : "."
  crt[row][col] = pixel
end

current_cycle = 1
current_x = 1

program.each do |instruction, *operands|
  if instruction == "noop"
    draw.call(current_cycle, current_x)
    current_cycle += 1
  elsif instruction == "addx"
    draw.call(current_cycle, current_x)
    current_cycle += 1
    draw.call(current_cycle, current_x)
    current_cycle += 1
    current_x += operands[0].to_i
  end
end

puts "part 2:"
crt.each do |line|
  puts line.join
end
