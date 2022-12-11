# frozen_string_literal: true

class MonkeyGame
  def initialize(monkeys, adjust_worry_level)
    @monkeys = monkeys
    @monkeys.each do |monkey|
      monkey.game = self
    end
    @adjust_worry_level = adjust_worry_level
  end

  def play_round
    @monkeys.each(&:take_turn)
  end

  def throw_to(monkey_number, item)
    @monkeys[monkey_number].catch_item(item)
  end

  def monkey_business_level
    m1, m2 = @monkeys.map(&:inspection_count).sort.last(2)
    m1 * m2
  end

  def adjust_worry_level(item)
    @adjust_worry_level.call(item)
  end
end
