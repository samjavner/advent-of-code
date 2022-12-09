# frozen_string_literal: true

require "./rope_bridge"

input = File.readlines("input.txt", chomp: true)

motions = input.map(&:split).map do |dir, steps|
  [
    case dir
    when "U"
      :up
    when "D"
      :down
    when "L"
      :left
    when "R"
      :right
    end,
    steps.to_i,
  ]
end

rope_bridge_1 = RopeBridge.new(length: 2)

motions.each do |dir, steps|
  rope_bridge_1.send(dir, steps)
end

puts "part 1: #{rope_bridge_1.tail_visited_count}"

rope_bridge_2 = RopeBridge.new(length: 10)

motions.each do |dir, steps|
  rope_bridge_2.send(dir, steps)
end

puts "part 2: #{rope_bridge_2.tail_visited_count}"
