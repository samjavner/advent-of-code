# frozen_string_literal: true

class Snafu
  @@mapping = {
    "=" => -2,
    "-" => -1,
    "0" => 0,
    "1" => 1,
    "2" => 2,
  }

  @@inverse = @@mapping.invert

  def initialize(value)
    @value = value.reverse
  end

  def +(other)
    a = value
    b = other.value

    result = ""
    carry = 0
    [a, b].map(&:length).max.times do |i|
      s = @@mapping[a[i] || "0"]
      t = @@mapping[b[i] || "0"]
      u = s + t + carry
      carry = (u + 2) / 5
      result = @@inverse[((u + 2) % 5) - 2] + result
    end

    if carry != 0
      result = @@inverse[carry] + result
    end

    Snafu.new(result)
  end

  def to_s
    value.reverse
  end

  protected

  attr_reader :value
end
