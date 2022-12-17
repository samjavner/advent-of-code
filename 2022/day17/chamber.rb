# frozen_string_literal: true

class Chamber
  def initialize(width:, shapes:, jet_pattern:)
    @width = width
    @shapes = shapes
    @jet_pattern = jet_pattern
    @dropped = 0
    @tower = []
    next_shape
  end

  def drop(n, debug = false)
    @jet_pattern.cycle.each do |direction|
      push(direction)
      unless fall
        come_to_rest
        next_shape
        draw if debug
      end
      break if @dropped == n
    end

    height
  end

  def drop_many(n)
    raise "should be multiple of n" unless n % @shapes.length == 0

    heights = []
    position = 0
    positions = []

    cycle_length = nil
    cycle_index = nil

    @jet_pattern.cycle.each do |direction|
      push(direction)
      unless fall
        come_to_rest

        if shape_index == 0
          heights.push(height)
          prev_index = positions.rindex(position)
          positions.push(position)
          unless prev_index.nil?
            index = positions.length - 1
            cycle_length = index - prev_index
            cycle_index = prev_index - cycle_length + 1
            (cycle_index..(prev_index - 1)).each do |i|
              if positions[i] != positions[i + cycle_length]
                cycle_length = nil
                break
              end
            end
          end
        end

        next_shape
      end
      break unless cycle_length.nil?

      position += 1
      position = 0 if position == @jet_pattern.length
    end

    height_at_start_of_cycle = heights[cycle_index]
    height_after_first_cycle = heights[cycle_index + cycle_length]
    height_per_cycle = height_after_first_cycle - height_at_start_of_cycle
    number_of_complete_cycles = n / @shapes.length / cycle_length
    remainder = (n / @shapes.length - cycle_index - 1) % cycle_length
    height_gained_during_cycle = heights.slice(cycle_index, cycle_length).map { |h| h - height_at_start_of_cycle }

    height_at_start_of_cycle + number_of_complete_cycles * height_per_cycle + height_gained_during_cycle[remainder]
  end

  private

  def height
    @tower.length
  end

  def rock?(row, col)
    return true if col < 0
    return true if col > @width - 1
    return true if row < 0
    return false if row > @tower.length - 1

    @tower[row][col] == :rock
  end

  def blocked?(row, col)
    blocked = false

    @shape.positions(row, col).each do |r, c|
      next unless rock?(r, c)

      blocked = true
      break
    end

    blocked
  end

  def push(direction)
    if direction == :left
      @shape_col -= 1 unless blocked?(@shape_row, @shape_col - 1)
    elsif direction == :right
      @shape_col += 1 unless blocked?(@shape_row, @shape_col + 1)
    end
  end

  def fall
    @shape_row -= 1 unless blocked?(@shape_row - 1, @shape_col)
  end

  def place(row, col)
    @tower.push(@width.times.map { :empty }) until @tower.length > row
    @tower[row][col] = :rock
  end

  def come_to_rest
    @shape.positions(@shape_row, @shape_col).each do |row, col|
      place(row, col)
    end
    @dropped += 1
  end

  def shape_index
    @dropped % @shapes.length
  end

  def next_shape
    @shape = @shapes[shape_index]
    @shape_row = height + 3
    @shape_col = 2
  end

  def draw
    puts "#{@dropped} dropped, #{height} height:"
    @tower.reverse.each do |row|
      puts "|#{row.map { |x| x == :rock ? "#" : "." }.join}|"
    end
    puts "+#{"-" * @width}+"
    puts
  end
end
