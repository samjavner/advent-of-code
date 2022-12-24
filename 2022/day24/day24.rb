# frozen_string_literal: true

Valley = Struct.new(:height, :width, :entrance_pos, :exit_pos)
State = Struct.new(:valley, :minute, :blizzards, :positions)

input = File.readlines("input.txt", chomp: true)

entrace_input, *valley_input, exit_input = input

valley = Valley.new(
  valley_input.length,
  valley_input[0].length - 2,
  [entrace_input.split("").find_index(".") - 1, -1],
  [exit_input.split("").find_index(".") - 1, input.length - 2],
)
blizzards = {}

valley_input.each_with_index do |line, y|
  _wall1, *grounds, _wall2 = line.split("")
  grounds.each_with_index do |ground, x|
    next if ground == "."

    blizzards[[x, y]] ||= []
    blizzards[[x, y]].push(
      case ground
      when "^"
        :up
      when "v"
        :down
      when "<"
        :left
      when ">"
        :right
      end,
    )
  end
end

def step_blizzards(valley, previous)
  blizzards = {}
  previous.each do |pos, pos_blizzards|
    pos_blizzards.each do |blizzard|
      x, y = pos
      case blizzard
      when :up
        y = (y - 1) % valley.height
      when :down
        y = (y + 1) % valley.height
      when :left
        x = (x - 1) % valley.width
      when :right
        x = (x + 1) % valley.width
      end
      blizzards[[x, y]] ||= []
      blizzards[[x, y]].push(blizzard)
    end
  end
  blizzards
end

def get_moves(valley, pos)
  x, y, status = pos

  [
    [x, y],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ].select do |x, y|
    [valley.entrance_pos, valley.exit_pos].include?([x, y]) ||
      (x >= 0 && x < valley.width && y >= 0 && y < valley.height)
  end.map do |x, y|
    if status == :initial && [x, y] == valley.exit_pos
      [x, y, :reached_exit]
    elsif status == :reached_exit && [x, y] == valley.entrance_pos
      [x, y, :reached_entrance_again]
    elsif status == :reached_entrance_again && [x, y] == valley.exit_pos
      [x, y, :reached_exit_again]
    else
      [x, y, status]
    end
  end
end

def step(state)
  blizzards = step_blizzards(state.valley, state.blizzards)
  positions = state
    .positions
    .map { |pos| get_moves(state.valley, pos) }
    .flatten(1)
    .uniq
    .select { |x, y, _status| blizzards[[x, y]].nil? }

  State.new(state.valley, state.minute + 1, blizzards, positions)
end

def solve(valley, blizzards, target_status)
  state = State.new(valley, 0, blizzards, [[*valley.entrance_pos, :initial]])
  loop do
    state = step(state)
    break if state.positions.any? { |_x, _y, status| status == target_status }
  end
  state.minute
end

puts "part 1: #{solve(valley, blizzards, :reached_exit)}"
puts "part 2: #{solve(valley, blizzards, :reached_exit_again)}"
