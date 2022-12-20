# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true).map(&:to_i)

def mix(coordinates)
  length = coordinates.length
  (0..(length - 1)).each do |n|
    c, old_i = coordinates[n]
    new_i = (old_i + c) % (length - 1)
    new_i = length - 1 if new_i == 0 && c < 0

    if new_i < old_i
      coordinates = coordinates.map do |d, j|
        if j < new_i
          [d, j]
        elsif j < old_i
          [d, j + 1]
        elsif j == old_i
          [d, new_i]
        else
          [d, j]
        end
      end
    elsif old_i < new_i
      coordinates = coordinates.map do |d, j|
        if j < old_i
          [d, j]
        elsif j == old_i
          [d, new_i]
        elsif j <= new_i
          [d, j - 1]
        else
          [d, j]
        end
      end
    end
  end
  coordinates
end

def get_grove_coordinates_sum(decrypted)
  index_0 = decrypted.find_index(0)
  decrypted[(index_0 + 1000) % decrypted.length] + decrypted[(index_0 + 2000) % decrypted.length] + decrypted[(index_0 + 3000) % decrypted.length]
end

def part_1(input)
  coordinates = input.each_with_index.map { |c, i| [c, i] }
  coordinates = mix(coordinates)
  coordinates = coordinates.sort { |a, b| a[1] <=> b[1] }.map { |c, _i| c }
  get_grove_coordinates_sum(coordinates)
end

puts "part 1: #{part_1(input)}"

def part_2(input)
  coordinates = input.each_with_index.map { |c, i| [c * 811589153, i] }
  10.times do
    coordinates = mix(coordinates)
  end
  coordinates = coordinates.sort { |a, b| a[1] <=> b[1] }.map { |c, _i| c }
  get_grove_coordinates_sum(coordinates)
end

puts "part 2: #{part_2(input)}"
