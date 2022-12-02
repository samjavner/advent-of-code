# frozen_string_literal: true

input = File.readlines("input.txt", chomp: true)

opponent_shapes = {
  "A" => :rock,
  "B" => :paper,
  "C" => :scissors,
}

player_shapes = {
  "X" => :rock,
  "Y" => :paper,
  "Z" => :scissors,
}

outcomes = {
  rock: {
    rock: :draw,
    paper: :win,
    scissors: :loss,
  },
  paper: {
    rock: :loss,
    paper: :draw,
    scissors: :win,
  },
  scissors: {
    rock: :win,
    paper: :loss,
    scissors: :draw,
  },
}

shape_scores = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

outcome_scores = {
  win: 6,
  draw: 3,
  loss: 0,
}

p1_guide = input.map(&:split).map { |o, p| [opponent_shapes[o], player_shapes[p]] }
p1_shape_score = p1_guide.map { |_o, p| shape_scores[p] }.sum
p1_outcomes_score = p1_guide.map { |o, p| outcomes[o][p] }.map { |x| outcome_scores[x] }.sum
p1_total_score = p1_shape_score + p1_outcomes_score

puts "part 1: #{p1_total_score}"

player_outcomes = {
  "X" => :loss,
  "Y" => :draw,
  "Z" => :win,
}

required_player_shape = outcomes.transform_values(&:invert)

p2_guide = input.map(&:split).map { |o, p| [opponent_shapes[o], player_outcomes[p]] }
p2_shape_score = p2_guide.map { |o, p| required_player_shape[o][p] }.map { |x| shape_scores[x] }.sum
p2_outcomes_score = p2_guide.map { |_o, p| outcome_scores[p] }.sum
p2_total_score = p2_shape_score + p2_outcomes_score

puts "part 2: #{p2_total_score}"
