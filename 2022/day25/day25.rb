# frozen_string_literal: true

require_relative "snafu"

input = File.readlines("input.txt", chomp: true).map { |v| Snafu.new(v) }

part_1 = input.reduce(Snafu.new("0"), &:+)

puts "part 1: #{part_1}"
