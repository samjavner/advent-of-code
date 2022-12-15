# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

readings = input.map do |line|
  data = /^Sensor at x=([-\d]*), y=([-\d]*): closest beacon is at x=([-\d]*), y=([-\d]*)$/.match(line)
  [[data[1].to_i, data[2].to_i], [data[3].to_i, data[4].to_i]]
end

get_beaconless_ranges = ->(target_y, exclude_beacon) do
  ranges = []
  readings.each do |sensor, beacon|
    d = (sensor[0] - beacon[0]).abs + (sensor[1] - beacon[1]).abs
    r = d - (sensor[1] - target_y).abs
    next if r < 0

    x1 = sensor[0] - r
    x2 = sensor[0] + r

    if exclude_beacon && beacon[1] == target_y
      next if r == 0

      x1 += 1 if beacon[0] == x1
      x2 -= 1 if beacon[0] == x2
    end

    ranges.push([x1, x2])
  end
  ranges
end

get_distinct_ranges = ->(ranges) do
  result = []
  remaining = ranges
  loop do
    r1, *others = remaining
    remaining = []
    done = true
    others.each do |r2|
      if r1[0] > r2[1] || r2[0] > r1[1]
        remaining.push(r2)
      else
        done = false
        r1 = [[r1[0], r2[0]].min, [r1[1], r2[1]].max]
      end
    end
    done ? result.push(r1) : remaining.push(r1)
    break unless remaining.any?
  end
  result
end

part1 = get_distinct_ranges.call(get_beaconless_ranges.call(2000000, true)).map { |x1, x2| x2 - x1 + 1 }.sum

puts "part 1: #{part1}"

4000001.times do |y|
  ranges = get_distinct_ranges.call(get_beaconless_ranges.call(y, false))
  range = ranges.find { |x1, _x2| (x1 > 0 && x1 < 4000000) }
  next unless range

  tuning_frequency = (range[0] - 1) * 4000000 + y
  puts "part 2: #{tuning_frequency}"
  break
end
