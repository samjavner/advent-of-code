# frozen_string_literal: true

require "./monkey_game"
require "./monkey"

input = File.readlines("input.txt", chomp: true)

get_monkeys = ->() do
  product_of_divisors = 1
  monkeys = input
    .slice_after(&:empty?)
    .map do |lines|
      items = lines[1].split(": ").last.split(", ").map(&:to_i).to_a

      _old, operator, old_or_value = lines[2].split("= ").last.split
      operation = ->(item) { item.send(operator, old_or_value == "old" ? item : old_or_value.to_i) }

      divisor = lines[3].split.last.to_i
      true_monkey = lines[4].split.last.to_i
      false_monkey = lines[5].split.last.to_i
      test = ->(item) { item % divisor == 0 ? true_monkey : false_monkey }

      product_of_divisors *= divisor

      Monkey.new(items: items, operation: operation, test: test)
    end
    .to_a

  [monkeys, product_of_divisors]
end

part1 = MonkeyGame.new(get_monkeys.call.first, ->(item) { item / 3 })

20.times do
  part1.play_round
end

puts "part 1: #{part1.monkey_business_level}"

monkeys, product_of_divisors = get_monkeys.call
part2 = MonkeyGame.new(monkeys, ->(item) { item % product_of_divisors })

10000.times do
  part2.play_round
end

puts "part 2: #{part2.monkey_business_level}"
