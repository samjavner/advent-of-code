interface Universe {
  scores: { [p: number]: number };
  positions: { [p: number]: number };
  turn: number;
  roll: number;
  accumulator: number;
}

const toString = ({ scores, positions, turn, roll, accumulator }: Universe) =>
  [
    scores[0],
    scores[1],
    positions[0],
    positions[1],
    turn,
    roll,
    accumulator,
  ].join(",");

export default (s0: number, s1: number) => {
  const starting: Universe = {
    scores: { 0: 0, 1: 0 },
    positions: { 0: s0, 1: s1 },
    turn: 0,
    roll: 0,
    accumulator: 0,
  };

  const universes = [starting];

  const universeCounts = {
    [toString(starting)]: 1,
  };

  let p0Wins = 0;
  let p1Wins = 0;

  while (universes.length > 0) {
    const [universe] = universes.splice(0, 1);

    const newUniverses = [1, 2, 3]
      .map(
        (v): Universe => ({
          ...universe,
          roll: universe.roll + 1,
          accumulator: universe.accumulator + v,
        })
      )
      .map((u): Universe => {
        if (u.roll < 3) {
          return u;
        }

        const newPosition =
          ((u.positions[u.turn] + u.accumulator - 1) % 10) + 1;

        return {
          ...u,
          scores: { ...u.scores, [u.turn]: u.scores[u.turn] + newPosition },
          positions: { ...u.positions, [u.turn]: newPosition },
          turn: (u.turn + 1) % 2,
          roll: 0,
          accumulator: 0,
        };
      });

    const ustr = toString(universe);
    const count = universeCounts[ustr];
    delete universeCounts[ustr];

    for (const n of newUniverses) {
      const str = toString(n);
      if (n.scores[0] >= 21) {
        p0Wins += count;
      } else if (n.scores[1] >= 21) {
        p1Wins += count;
      } else if (universeCounts[str]) {
        universeCounts[str] += count;
      } else {
        universes.push(n);
        universeCounts[str] = count;
      }
    }
  }

  console.log("part 1: %d", Math.max(p0Wins, p1Wins));
};
