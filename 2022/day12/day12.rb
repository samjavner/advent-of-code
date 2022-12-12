# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

hill = input.map { |row| row.split("") }.to_a

s = []
e = []
hill.each_with_index do |row, r|
  row.each_with_index do |height, c|
    if height == "S"
      s = [r, c]
      hill[r][c] = 1
    elsif height == "E"
      e = [r, c]
      hill[r][c] = 26
    else
      hill[r][c] = hill[r][c].ord - 96
    end
  end
end

queue = [[s, 0]]
visited = {}
e_steps = 0
while queue.any?
  current, *queue = queue
  position, steps = current
  r, c = position

  if r == e[0] && c == e[1]
    e_steps = steps
    break
  end

  height = hill[r][c]
  hash_key = "#{r},#{c}".hash
  next if visited[hash_key]

  visited["#{r},#{c}".hash] = true

  if r > 0 && hill[r - 1][c] <= height + 1
    queue.push([[r - 1, c], steps + 1])
  end

  if r < hill.length - 1 && hill[r + 1][c] <= height + 1
    queue.push([[r + 1, c], steps + 1])
  end

  if c > 0 && hill[r][c - 1] <= height + 1
    queue.push([[r, c - 1], steps + 1])
  end

  if c < hill[0].length - 1 && hill[r][c + 1] <= height + 1
    queue.push([[r, c + 1], steps + 1])
  end
end

puts "part 1: #{e_steps}"

queue = [[e, 0]]
visited = {}
a_steps = 0
while queue.any?
  current, *queue = queue
  position, steps = current
  r, c = position
  height = hill[r][c]
  if height == 1
    a_steps = steps
    break
  end
  hash_key = "#{r},#{c}".hash
  next if visited[hash_key]

  visited["#{r},#{c}".hash] = true

  if r > 0 && hill[r - 1][c] >= height - 1
    queue.push([[r - 1, c], steps + 1])
  end

  if r < hill.length - 1 && hill[r + 1][c] >= height - 1
    queue.push([[r + 1, c], steps + 1])
  end

  if c > 0 && hill[r][c - 1] >= height - 1
    queue.push([[r, c - 1], steps + 1])
  end

  if c < hill[0].length - 1 && hill[r][c + 1] >= height - 1
    queue.push([[r, c + 1], steps + 1])
  end
end

puts "part 1: #{a_steps}"
