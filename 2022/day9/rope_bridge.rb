# frozen_string_literal: true

class RopeBridge
  attr_accessor :debug

  def initialize(length:)
    @debug = false
    @rope = length.times.map { [0, 0] }
    @tail_visited = {}
    @tail_visited["0,0".hash] = true
  end

  def up(steps)
    puts "up #{steps}" if @debug
    steps.times do
      @rope.first[1] -= 1
      step_tail
    end
  end

  def down(steps)
    puts "down #{steps}" if @debug
    steps.times do
      @rope.first[1] += 1
      step_tail
    end
  end

  def left(steps)
    puts "left #{steps}" if @debug
    steps.times do
      @rope.first[0] -= 1
      step_tail
    end
  end

  def right(steps)
    puts "right #{steps}" if @debug
    steps.times do
      @rope.first[0] += 1
      step_tail
    end
  end

  def tail_visited_count
    @tail_visited.length
  end

  private

  def step_tail
    (0..(@rope.length - 2)).each do |p|
      hx, hy = @rope[p]
      tx, ty = @rope[p + 1]
      adjacent = (hx - tx).abs <= 1 && (hy - ty).abs <= 1
      dx = hx <=> tx
      dy = hy <=> ty
      @rope[p + 1] = [tx + dx, ty + dy] unless adjacent
    end

    @tail_visited["#{@rope.last[0]},#{@rope.last[1]}".hash] = true
    puts @rope.to_s if @debug
  end
end
