# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

datastream = input[0].split("")

find_start = ->(window_length) do
  windows = (datastream.length - window_length + 1).times.map do |index|
    datastream.slice(index, window_length)
  end

  index = windows.find_index do |window|
    window.uniq.length == window_length
  end

  window_length + index
end

puts "part 1: #{find_start.call(4)}"
puts "part 2: #{find_start.call(14)}"
