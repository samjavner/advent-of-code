# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

paths = input.map { |line| line.split(" -> ").map { |coord| coord.split(",").map(&:to_i) } }

cave = {}
min_x = 10000
max_x = 0
max_y = 0

reset_cave = ->() do
  cave = {}
  min_x = 10000
  max_x = 0
  max_y = 0

  paths.each do |path|
    (0..(path.length - 2)).each do |index|
      x1, y1 = path[index]
      x2, y2 = path[index + 1]
      min_x = [min_x, x1, x2].min
      max_x = [max_x, x1, x2].max
      max_y = [max_y, y1, y2].max
      if x1 == x2
        y1, y2 = [y1, y2].sort
        (y1..y2).each do |y|
          cave[[x1, y]] = "#"
        end
      elsif y1 == y2
        x1, x2 = [x1, x2].sort
        (x1..x2).each do |x|
          cave[[x, y1]] = "#"
        end
      end
    end
  end
end

reset_cave.call

units_of_sand = 0
done = false
loop do
  coord = [500, 0]
  loop do
    x, y = coord

    if x < min_x || x > max_x || y > max_y
      done = true
      break
    end

    if cave[[x, y + 1]].nil?
      coord = [x, y + 1]
    elsif cave[[x - 1, y + 1]].nil?
      coord = [x - 1, y + 1]
    elsif cave[[x + 1, y + 1]].nil?
      coord = [x + 1, y + 1]
    else
      cave[coord] = "o"
      units_of_sand += 1
      break
    end
  end
  break if done
end

puts "part 1: #{units_of_sand}"

reset_cave.call

units_of_sand = 0
loop do
  coord = [500, 0]
  loop do
    x, y = coord

    if cave[[x, y + 1]].nil? && y != max_y + 1
      coord = [x, y + 1]
    elsif cave[[x - 1, y + 1]].nil? && y != max_y + 1
      coord = [x - 1, y + 1]
    elsif cave[[x + 1, y + 1]].nil? && y != max_y + 1
      coord = [x + 1, y + 1]
    else
      cave[coord] = "o"
      units_of_sand += 1
      break
    end
  end
  break if cave[[500, 0]] == "o"
end

puts "part 2: #{units_of_sand}"
