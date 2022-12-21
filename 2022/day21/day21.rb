# frozen_string_literal: true

Monkey = Struct.new(:name, :number, :operation)
Operation = Struct.new(:left, :operator, :right)

input = File.readlines("input.txt", chomp: true)

def get_monkeys(input)
  input.map do |line|
    name, number_or_operation = line.split(": ")
    number = nil
    operation = nil
    if number_or_operation.include?(" ")
      left, operator, right = number_or_operation.split
      operation = Operation.new(left, operator, right)
    else
      number = number_or_operation.to_i
    end
    [name, Monkey.new(name, number, operation)]
  end.to_h
end

monkeys = get_monkeys(input)
while monkeys["root"].number.nil?
  monkeys.values.select { |monkey| monkey.number.nil? }.each do |monkey|
    left = monkeys[monkey.operation.left]
    right = monkeys[monkey.operation.right]
    if left.number && right.number
      monkey.number = left.number.send(monkey.operation.operator, right.number)
    end
  end
end

puts "part 1: #{monkeys["root"].number}"

def get_equality_test(monkeys)
  root = monkeys["root"]
  Operation.new(
    substitute(monkeys, root.operation.left),
    "=",
    substitute(monkeys, root.operation.right),
  )
end

def substitute(monkeys, name)
  monkey = monkeys[name]
  if name == "humn"
    "humn"
  elsif !monkey.number.nil?
    monkey.number
  else
    left = substitute(monkeys, monkey.operation.left)
    right = substitute(monkeys, monkey.operation.right)
    if left.class == Integer && right.class == Integer
      left.send(monkey.operation.operator, right)
    else
      Operation.new(left, monkey.operation.operator, right)
    end
  end
end

def solve(equality_test)
  left, right = if equality_test.left.class == Integer
    [equality_test.right, equality_test.left]
  else
    [equality_test.left, equality_test.right]
  end

  until left == "humn"
    case left.operator
    when "*"
      if left.left.class == Integer
        right /= left.left
        left = left.right
      else
        right /= left.right
        left = left.left
      end
    when "/"
      if left.left.class == Integer
        right = left.left / right
        right = left.right
      else
        right *= left.right
        left = left.left
      end
    when "+"
      if left.left.class == Integer
        right -= left.left
        left = left.right
      else
        right -= left.right
        left = left.left
      end
    when "-"
      if left.left.class == Integer
        right = left.left - right
        left = left.right
      else
        right += left.right
        left = left.left
      end
    end
  end

  right
end

monkeys = get_monkeys(input)
equality_test = get_equality_test(monkeys)
solution = solve(equality_test)

puts "part 2: #{solution}"
