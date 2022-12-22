# frozen_string_literal: true

State = Struct.new(:row, :col, :facing)

input = File.readlines("input.txt", chomp: true)
*map_input, _empty, path_input = input

map = {}
map_input.each_with_index do |line, y|
  row = y + 1
  map[row] = {}
  line.split("").each_with_index do |c, x|
    col = x + 1
    if c == "."
      map[row][col] = :open
    elsif c == "#"
      map[row][col] = :wall
    end
  end
end

path = path_input
  .split("")
  .slice_when { |x, y| ["L", "R"].include?(x) || ["L", "R"].include?(y) }
  .map do |x|
    if x[0] == "L"
      :turn_left
    elsif x[0] == "R"
      :turn_right
    else
      x.join.to_i
    end
  end

def get_initial_state(map)
  State.new(1, map[1].keys.min, :right)
end

def get_next_facing(current, instruction)
  case [current, instruction]
  when [:right, :turn_left]
    :up
  when [:right, :turn_right]
    :down
  when [:down, :turn_left]
    :right
  when [:down, :turn_right]
    :left
  when [:left, :turn_left]
    :down
  when [:left, :turn_right]
    :up
  when [:up, :turn_left]
    :left
  when [:up, :turn_right]
    :right
  end
end

def move_1_2d(map, state)
  row = state.row
  col = state.col
  test_row = row
  test_col = col

  case state.facing
  when :left
    test_col = col - 1
    if map[row][test_col].nil?
      test_col = map[row].keys.max
    end
  when :right
    test_col = col + 1
    if map[row][test_col].nil?
      test_col = map[row].keys.min
    end
  when :up
    test_row = row - 1
    if map[test_row].nil? || map[test_row][col].nil?
      test_row = map.keys.max
      test_row -= 1 while map[test_row][col].nil?
    end
  when :down
    test_row = row + 1
    if map[test_row].nil? || map[test_row][col].nil?
      test_row = map.keys.min
      test_row += 1 while map[test_row][col].nil?
    end
  end

  map[test_row][test_col] == :wall ? State.new(row, col, state.facing) : State.new(test_row, test_col, state.facing)
end

def get_next_state(map, state, instruction, three_d = false)
  if [:turn_left, :turn_right].include?(instruction)
    State.new(state.row, state.col, get_next_facing(state.facing, instruction))
  elsif instruction > 0
    if three_d
      get_next_state(map, move_1_3d(map, state), instruction - 1, three_d)
    else
      get_next_state(map, move_1_2d(map, state), instruction - 1, three_d)
    end
  else
    state
  end
end

def get_final_password(state)
  facing = case state.facing
  when :right
    0
  when :down
    1
  when :left
    2
  when :up
    3
  end

  1000 * state.row + 4 * state.col + facing
end

part_1 = get_final_password(
  path.reduce(get_initial_state(map)) do |current, instruction|
    get_next_state(map, current, instruction)
  end,
)

puts "part 1: #{part_1}"

# This is not general. It is tailored to the puzzle input.
def move_1_3d(map, state)
  row = state.row
  col = state.col
  test_row = row
  test_col = col
  test_facing = state.facing

  case state.facing
  when :left
    test_col = col - 1
    if map[row][test_col].nil?
      if row <= 50
        test_col = 1
        test_row = 151 - row
        test_facing = :right
      elsif row <= 100
        test_row = 101
        test_col = row - 50
        test_facing = :down
      elsif row <= 150
        test_col = 51
        test_row = 151 - row
        test_facing = :right
      else
        test_row = 1
        test_col = row - 100
        test_facing = :down
      end
    end
  when :right
    test_col = col + 1
    if map[row][test_col].nil?
      if row <= 50
        test_col = 100
        test_row = 151 - row
        test_facing = :left
      elsif row <= 100
        test_row = 50
        test_col = row + 50
        test_facing = :up
      elsif row <= 150
        test_col = 150
        test_row = 151 - row
        test_facing = :left
      else
        test_row = 150
        test_col = row - 100
        test_facing = :up
      end
    end
  when :up
    test_row = row - 1
    if map[test_row].nil? || map[test_row][col].nil?
      if col <= 50
        test_col = 51
        test_row = col + 50
        test_facing = :right
      elsif col <= 100
        test_col = 1
        test_row = col + 100
        test_facing = :right
      else
        test_row = 200
        test_col = col - 100
        test_facing = :up
      end
    end
  when :down
    test_row = row + 1
    if map[test_row].nil? || map[test_row][col].nil?
      if col <= 50
        test_row = 1
        test_col = col + 100
        test_facing = :down
      elsif col <= 100
        test_col = 50
        test_row = col + 100
        test_facing = :left
      else
        test_col = 100
        test_row = col - 50
        test_facing = :left
      end
    end
  end

  map[test_row][test_col] == :wall ? State.new(row, col, state.facing) : State.new(test_row, test_col, test_facing)
end

part_2 = get_final_password(
  path.reduce(get_initial_state(map)) do |current, instruction|
    get_next_state(map, current, instruction, true)
  end,
)

puts "part 2: #{part_2}"
