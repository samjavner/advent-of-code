# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

raw_stacks, raw_procedure = input
  .chunk(&:empty?)
  .reject { |x| x[0] }
  .map(&:last)
  .to_a

def stacks(raw_stacks)
  raw_names, *raw_crates = raw_stacks.reverse

  crates_array = raw_crates.map do |row|
    row.split("").each_slice(4).map { |x| x[1].strip }
  end

  raw_names.split.each_with_index.map do |name, index|
    crates = crates_array.map { |row| row[index] }.reject(&:empty?)
    [name, crates]
  end.to_h
end

Move = Struct.new(:quantity, :from, :to)

procedure = raw_procedure.map do |line|
  _move, quantity, _from, from, _to, to = line.split
  Move.new(quantity.to_i, from, to)
end

p1_stacks = stacks(raw_stacks)
procedure.each do |move|
  move.quantity.times.each do
    crate = p1_stacks[move.from].pop
    p1_stacks[move.to].push(crate)
  end
end

p1_tops = p1_stacks.keys.map { |name| p1_stacks[name].last }

puts "part 1: #{p1_tops.join}"

p2_stacks = stacks(raw_stacks)
procedure.each do |move|
  crates_to_move = p2_stacks[move.from].last(move.quantity)
  p2_stacks[move.from] = p2_stacks[move.from].first(p2_stacks[move.from].length - move.quantity)
  p2_stacks[move.to] = p2_stacks[move.to].concat(crates_to_move)
end

p2_tops = p2_stacks.keys.map { |name| p2_stacks[name].last }

puts "part 2: #{p2_tops.join}"
