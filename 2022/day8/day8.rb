# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

map = input.map { |row| row.split("").map(&:to_i).to_a }.to_a
height = map.length
width = map[0].length

is_visible = ->(x, y) do
  h = map[y][x]

  # north
  v = true
  (y - 1).step(to: 0, by: -1) do |cy|
    if map[cy][x] >= h
      v = false
      break
    end
  end
  return true if v

  # south
  v = true
  (y + 1).step(to: height - 1) do |cy|
    if map[cy][x] >= h
      v = false
      break
    end
  end
  return true if v

  # west
  v = true
  (x - 1).step(to: 0, by: -1) do |cx|
    if map[y][cx] >= h
      v = false
      break
    end
  end
  return true if v

  # east
  v = true
  (x + 1).step(to: width - 1) do |cx|
    if map[y][cx] >= h
      v = false
      break
    end
  end
  return true if v

  false
end

get_visible_count = ->() do
  count = 0
  width.times do |x|
    height.times do |y|
      count += 1 if is_visible.call(x, y)
    end
  end
  count
end

puts "part 1: #{get_visible_count.call}"

get_scenic_score = ->(x, y) do
  h = map[y][x]

  # north
  n = 0
  (y - 1).step(to: 0, by: -1) do |cy|
    n += 1
    break if map[cy][x] >= h
  end

  # south
  s = 0
  (y + 1).step(to: height - 1) do |cy|
    s += 1
    break if map[cy][x] >= h
  end

  # west
  w = 0
  (x - 1).step(to: 0, by: -1) do |cx|
    w += 1
    break if map[y][cx] >= h
  end

  # east
  e = 0
  (x + 1).step(to: width - 1) do |cx|
    e += 1
    break if map[y][cx] >= h
  end

  n * s * w * e
end

get_max_scenic_score = ->() do
  max = 0
  width.times do |x|
    height.times do |y|
      current = get_scenic_score.call(x, y)
      max = [max, current].max
    end
  end
  max
end

puts "part 2: #{get_max_scenic_score.call}"
