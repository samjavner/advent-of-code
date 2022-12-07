# frozen_string_literal: true

require "./directory"
require "./file"
require "./debug_visitor"
require "./part1_visitor"
require "./part2_visitor"

input = File.readlines("input.txt", chomp: true)

first_command, *commands = input.slice_before { |line| line.start_with?("$") }.to_a
raise "Expected first command to be '$ cd /'" unless first_command.first == "$ cd /"

root = Day7::Directory.new("<root>", nil)

current_directory = root
commands.each do |command, *output|
  if command == "$ ls"
    output.each do |child|
      if child.start_with?("dir")
        _dir, name = child.split
        current_directory.directories.push(Day7::Directory.new(name, current_directory))
      else
        size, name = child.split
        current_directory.files.push(Day7::File.new(name, size.to_i))
      end
    end
  elsif command.start_with?("$ cd")
    _dollar, _cd, name = command.split
    current_directory = if name == ".."
      current_directory.parent
    else
      current_directory.directories.find { |child| child.name == name }
    end
  end
end

# debug = Day7::DebugVisitor.new
# root.accept(debug)

part1 = Day7::Part1Visitor.new
root.accept(part1)
puts "part 1: #{part1.answer}"

part2 = Day7::Part2Visitor.new(root)
root.accept(part2)
puts "part 2: #{part2.answer}"
