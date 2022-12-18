# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

cubes = input
  .map { |line| line.split(",").map(&:to_i) }
  .to_h { |cube| [cube, true] }

def get_neighbors(cube)
  x, y, z = cube

  [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ]
end

surface_area = cubes.keys.map do |cube|
  get_neighbors(cube)
    .map { |n| cubes[n] }
    .select(&:nil?)
    .length
end.sum

puts "part 1: #{surface_area}"

min_x = cubes.keys.map { |cube| cube[0] }.min - 1
max_x = cubes.keys.map { |cube| cube[0] }.max + 1
min_y = cubes.keys.map { |cube| cube[1] }.min - 1
max_y = cubes.keys.map { |cube| cube[1] }.max + 1
min_z = cubes.keys.map { |cube| cube[2] }.min - 1
max_z = cubes.keys.map { |cube| cube[2] }.max + 1

exterior = {}
remaining = [[min_x, min_y, min_z]]
until remaining.empty?
  current = remaining.pop
  exterior[current] = true
  remaining += get_neighbors(current)
    .reject { |x, y, z| x < min_x || x > max_x || y < min_y || y > max_y || z < min_z || z > max_z }
    .map { |n| [n, cubes[n], exterior[n]] }
    .select { |_n, c, e| c.nil? && e.nil? }
    .map { |n, _c, _e| n }
end

exterior_surface_area = cubes.keys.map do |cube|
  get_neighbors(cube)
    .map { |n| [cubes[n], exterior[n]] }
    .select { |c, e| c.nil? && !e.nil? }
    .length
end.sum

puts "part 2: #{exterior_surface_area}"
