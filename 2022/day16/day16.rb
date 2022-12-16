# frozen_string_literal: true

Valve = Struct.new(:label, :flow_rate, :tunnels)
State = Struct.new(:current, :open_valves, :open_flow_rate, :pressure_released)
VisitedKey = Struct.new(:current, :open_valves)

input = File.readlines("input.txt", chomp: true)

valves = input.map do |line|
  match = /^Valve (\w\w) has flow rate=(\d*); tunnels? leads? to valves? (.*)$/.match(line)
  Valve.new(match[1], match[2].to_i, match[3].split(", "))
end.to_h { |valve| [valve.label, valve] }

next_states = {}
next_states[VisitedKey.new("AA", [])] = State.new("AA", [], 0, 0)
visited = {}
30.times do
  current_states = next_states
  next_states = {}
  current_states.values.each do |state|
    current = valves[state.current]
    candidates = []

    if current.flow_rate > 0 && !state.open_valves.include?(current.label)
      candidates.push(State.new(
        current.label,
        [*state.open_valves, current.label].sort,
        state.open_flow_rate + current.flow_rate,
        state.pressure_released + state.open_flow_rate,
      ))
    end

    current.tunnels.each do |tunnel|
      candidates.push(State.new(
        tunnel,
        state.open_valves,
        state.open_flow_rate,
        state.pressure_released + state.open_flow_rate,
      ))
    end

    candidates.each do |candidate|
      key = VisitedKey.new(candidate.current, candidate.open_valves)
      unless visited[key] && visited[key] >= candidate.pressure_released
        next_states[key] = candidate
        visited[key] = candidate.pressure_released
      end
    end
  end
end

part1 = next_states.values.map(&:pressure_released).max

puts "part 1: #{part1}"

upper_bound_per_minute = valves.values.map(&:flow_rate).sum
lower_bound_of_solution = 0
next_states = {}
next_states[VisitedKey.new(["AA", "AA"], [])] = State.new(["AA", "AA"], [], 0, 0)
visited = {}
minutes = 26
(1..minutes).each do |n|
  current_states = next_states
  next_states = {}
  current_states.values.each do |state|
    current1 = valves[state.current[0]]
    current2 = valves[state.current[1]]
    partial_candidates = []

    if current1.flow_rate > 0 && !state.open_valves.include?(current1.label)
      partial_candidates.push(State.new(
        current1.label,
        [*state.open_valves, current1.label].sort,
        state.open_flow_rate + current1.flow_rate,
        state.pressure_released + state.open_flow_rate,
      ))
    end

    current1.tunnels.each do |tunnel|
      partial_candidates.push(State.new(
        tunnel,
        state.open_valves,
        state.open_flow_rate,
        state.pressure_released + state.open_flow_rate,
      ))
    end

    partial_candidates.each do |partial_candidate|
      candidates = []

      if current2.flow_rate > 0 && !partial_candidate.open_valves.include?(current2.label)
        candidates.push(State.new(
          [partial_candidate.current, current2.label].sort,
          [*partial_candidate.open_valves, current2.label].sort,
          partial_candidate.open_flow_rate + current2.flow_rate,
          partial_candidate.pressure_released,
        ))
      end

      current2.tunnels.each do |tunnel|
        candidates.push(State.new(
          [partial_candidate.current, tunnel].sort,
          partial_candidate.open_valves,
          partial_candidate.open_flow_rate,
          partial_candidate.pressure_released,
        ))
      end

      candidates.each do |candidate|
        key = VisitedKey.new(candidate.current, candidate.open_valves)
        next if visited[key] && visited[key] >= candidate.pressure_released

        candidate_upper_bound = candidate.pressure_released + upper_bound_per_minute * (minutes - n)
        next if candidate_upper_bound < lower_bound_of_solution

        candidate_lower_bound = candidate.pressure_released + candidate.open_flow_rate * (minutes - n)
        lower_bound_of_solution = [lower_bound_of_solution, candidate_lower_bound].max
        next_states[key] = candidate
        visited[key] = candidate.pressure_released
      end
    end
  end
end

part2 = next_states.values.map(&:pressure_released).max

# this takes awhile
puts "part 2: #{part2}"
