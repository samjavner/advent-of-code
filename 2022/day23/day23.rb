# frozen_string_literal: true

State = Struct.new(:elves, :round)

input = File.readlines("input.txt", chomp: true)

elves = input
  .each_with_index
  .map { |line, y| line.split("").each_with_index.filter { |scan, _x| scan == "#" }.map { |_scan, x| [x, y] } }
  .flatten(1)
  .map { |pos| [pos, true] }
  .to_h

def step(state)
  elves = state.elves
  directions = [:north, :south, :west, :east].rotate(state.round)

  # first half

  proposals = {}
  stationary = []
  elves.keys.each do |x, y|
    n_open = elves[[x, y - 1]].nil?
    s_open = elves[[x, y + 1]].nil?
    w_open = elves[[x - 1, y]].nil?
    e_open =  elves[[x + 1, y]].nil?
    nw_open = elves[[x - 1, y - 1]].nil?
    ne_open = elves[[x + 1, y - 1]].nil?
    sw_open = elves[[x - 1, y + 1]].nil?
    se_open = elves[[x + 1, y + 1]].nil?

    if [n_open, s_open, w_open, e_open, nw_open, ne_open, sw_open, se_open].all? { |x| x == true }
      stationary.push([x, y])
      next
    end

    proposal = nil
    directions.each do |direction|
      case direction
      when :north
        proposal = [x, y - 1] if n_open && ne_open && nw_open
      when :south
        proposal = [x, y + 1] if s_open && se_open && sw_open
      when :west
        proposal = [x - 1, y] if w_open && nw_open && sw_open
      when :east
        proposal = [x + 1, y] if e_open && ne_open && se_open
      end
      break unless proposal.nil?
    end

    if proposal.nil?
      stationary.push([x, y])
    else
      proposals[proposal] = [] if proposals[proposal].nil?
      proposals[proposal].push([x, y])
    end
  end

  # second half

  elves = {}

  stationary.each do |x, y|
    elves[[x, y]] = true
  end

  proposals.each do |pos, pos_elves|
    if pos_elves.length == 1
      elves[pos] = true
    else
      pos_elves.each do |elf|
        elves[elf] = true
      end
    end
  end

  State.new(elves, state.round + 1)
end

def bounds(state)
  [
    [
      state.elves.keys.map(&:first).min,
      state.elves.keys.map(&:last).min,
    ],
    [
      state.elves.keys.map(&:first).max,
      state.elves.keys.map(&:last).max,
    ],
  ]
end

def empty_ground_tiles(state)
  lower, upper = bounds(state)
  min_x, min_y = lower
  max_x, max_y = upper

  (max_x - min_x + 1) * (max_y - min_y + 1) - state.elves.keys.length
end

def draw(state)
  lower, upper = bounds(state)
  min_x, min_y = lower
  max_x, max_y = upper

  puts "== End of Round #{state.round} =="
  (min_y..max_y).each do |y|
    puts (min_x..max_x).map { |x| state.elves[[x, y]].nil? ? "." : "#" }.join
  end
  puts
end

part_1 = empty_ground_tiles(
  (1..10).reduce(State.new(elves, 0)) { |current, _round| step(current) },
)

puts "part 1: #{part_1}"

state = State.new(elves, 0)
loop do
  previous = state
  state = step(previous)
  break if state.elves == previous.elves
end

puts "part 2: #{state.round}"
