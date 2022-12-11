# frozen_string_literal: true

class Monkey
  attr_reader :inspection_count
  attr_writer :game

  def initialize(items:, operation:, test:)
    @items = items
    @operation = operation
    @test = test
    @inspection_count = 0
  end

  def take_turn
    @items.each do |item|
      item = inspect_item(item)
      item = @game.adjust_worry_level(item)
      new_monkey = @test.call(item)
      @game.throw_to(new_monkey, item)
    end

    @items = []
  end

  def inspect_item(item)
    item = @operation.call(item)
    @inspection_count += 1
    item
  end

  def catch_item(item)
    @items.push(item)
  end
end
