# frozen_string_literal: true

Blueprint = Struct.new(
  :id,
  :ore_robot_ore_cost,
  :clay_robot_ore_cost,
  :obsidian_robot_ore_cost,
  :obsidian_robot_clay_cost,
  :geode_robot_ore_cost,
  :geode_robot_obsidian_cost,
)

State = Struct.new(
  :ore_robots,
  :clay_robots,
  :obsidian_robots,
  :geode_robots,
  :ores,
  :clays,
  :obsidians,
  :geodes,
)

input = File.readlines("input.txt", chomp: true)

regex = /^Blueprint (\d*): Each ore robot costs (\d*) ore. Each clay robot costs (\d*) ore. Each obsidian robot costs (\d*) ore and (\d*) clay. Each geode robot costs (\d*) ore and (\d*) obsidian.$/

blueprints = input.map do |line|
  match = regex.match(line)
  Blueprint.new(match[1].to_i, match[2].to_i, match[3].to_i, match[4].to_i, match[5].to_i, match[6].to_i, match[7].to_i)
end

def get_lower_bound(blueprint, minutes, state, minute)
  ore_robots = state.ore_robots
  obsidian_robots = state.obsidian_robots
  geode_robots = state.geode_robots

  ores = state.ores
  obsidians = state.obsidians
  geodes = state.geodes

  (minutes - minute).times do
    geodes += geode_robots

    if ores >= blueprint.geode_robot_ore_cost && obsidians >= blueprint.geode_robot_obsidian_cost
      ores -= blueprint.geode_robot_ore_cost
      obsidians -= blueprint.geode_robot_obsidian_cost
      geode_robots += 1
    end

    ores += ore_robots
    obsidians += obsidian_robots
  end

  geodes
end

def get_upper_bound(blueprint, minutes, state, minute)
  ore_robots = state.ore_robots
  clay_robots = state.clay_robots
  obsidian_robots = state.obsidian_robots
  geode_robots = state.geode_robots

  ores = state.ores
  clays = state.clays
  obsidians = state.obsidians
  geodes = state.geodes

  (minutes - minute).times do
    new_ores = ores + ore_robots
    new_clays = clays + clay_robots
    new_obsidians = obsidians + obsidian_robots
    new_geodes = geodes + geode_robots

    ore_robots += 1
    clay_robots += 1

    if ores >= blueprint.obsidian_robot_ore_cost && clays >= blueprint.obsidian_robot_clay_cost
      new_ores -= blueprint.obsidian_robot_ore_cost
      new_clays -= blueprint.obsidian_robot_clay_cost
      obsidian_robots += 1
    end

    if ores >= blueprint.geode_robot_ore_cost && obsidians >= blueprint.geode_robot_obsidian_cost
      new_ores -= blueprint.geode_robot_ore_cost
      new_obsidians -= blueprint.geode_robot_obsidian_cost
      geode_robots += 1
    end

    ores = new_ores
    clays = new_clays
    obsidians = new_obsidians
    geodes = new_geodes
  end

  geodes
end

def get_geodes(blueprint, minutes)
  next_states = [State.new(1, 0, 0, 0, 0, 0, 0, 0)]
  lower_bound = 0
  minutes.times do |minute|
    current_states = next_states
    next_states = []
    current_states.each do |current|
      lower_bound = [lower_bound, get_lower_bound(blueprint, minutes, current, minute)].max

      new_ores = current.ores + current.ore_robots
      new_clays = current.clays + current.clay_robots
      new_obsidians = current.obsidians + current.obsidian_robots
      new_geodes = current.geodes + current.geode_robots

      can_build_robots = 0

      if current.ores >= blueprint.ore_robot_ore_cost
        can_build_robots += 1

        candidate = State.new(
          current.ore_robots + 1,
          current.clay_robots,
          current.obsidian_robots,
          current.geode_robots,
          new_ores - blueprint.ore_robot_ore_cost,
          new_clays,
          new_obsidians,
          new_geodes,
        )

        if get_upper_bound(blueprint, minutes, candidate, minute + 1) > lower_bound
          next_states.push(candidate)
        end
      end

      if current.ores >= blueprint.clay_robot_ore_cost
        can_build_robots += 1

        candidate = State.new(
          current.ore_robots,
          current.clay_robots + 1,
          current.obsidian_robots,
          current.geode_robots,
          new_ores - blueprint.clay_robot_ore_cost,
          new_clays,
          new_obsidians,
          new_geodes,
        )

        if get_upper_bound(blueprint, minutes, candidate, minute + 1) > lower_bound
          next_states.push(candidate)
        end
      end

      if current.ores >= blueprint.obsidian_robot_ore_cost && current.clays >= blueprint.obsidian_robot_clay_cost
        can_build_robots += 1

        candidate = State.new(
          current.ore_robots,
          current.clay_robots,
          current.obsidian_robots + 1,
          current.geode_robots,
          new_ores - blueprint.obsidian_robot_ore_cost,
          new_clays - blueprint.obsidian_robot_clay_cost,
          new_obsidians,
          new_geodes,
        )

        if get_upper_bound(blueprint, minutes, candidate, minute + 1) > lower_bound
          next_states.push(candidate)
        end
      end

      if current.ores >= blueprint.geode_robot_ore_cost && current.obsidians >= blueprint.geode_robot_obsidian_cost
        can_build_robots += 1

        candidate = State.new(
          current.ore_robots,
          current.clay_robots,
          current.obsidian_robots,
          current.geode_robots + 1,
          new_ores - blueprint.obsidian_robot_ore_cost,
          new_clays,
          new_obsidians - blueprint.geode_robot_obsidian_cost,
          new_geodes,
        )

        if get_upper_bound(blueprint, minutes, candidate, minute + 1) > lower_bound
          next_states.push(candidate)
        end
      end

      next if can_build_robots == 4

      candidate = State.new(
        current.ore_robots,
        current.clay_robots,
        current.obsidian_robots,
        current.geode_robots,
        new_ores,
        new_clays,
        new_obsidians,
        new_geodes,
      )

      if get_upper_bound(blueprint, minutes, candidate, minute + 1) > lower_bound
        next_states.push(candidate)
      end
    end
  end

  lower_bound
end

quality_levels = blueprints.map do |blueprint|
  get_geodes(blueprint, 24) * blueprint.id
end

puts "part 1: #{quality_levels.sum}"

part_2 = get_geodes(blueprints[0], 32) * get_geodes(blueprints[1], 32) * get_geodes(blueprints[2], 32)

# This code is buggy, maybe an off by one error somewhere.
# I get the wrong answer on the input in the problem statement.

puts "part 2: #{part_2}"
