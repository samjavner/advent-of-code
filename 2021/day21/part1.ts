export default (s0: number, s1: number) => {
  let nextRoll = 1;
  const roll = (): number => nextRoll++ % 100;

  const scores = { 0: 0, 1: 0 };
  const positions = { 0: s0, 1: s1 };
  let currentPlayer: 0 | 1 = 0;
  while (true) {
    const totalRoll = roll() + roll() + roll();
    positions[currentPlayer] =
      ((positions[currentPlayer] + totalRoll - 1) % 10) + 1;
    scores[currentPlayer] += positions[currentPlayer];
    if (scores[currentPlayer] >= 1000) {
      break;
    }
    currentPlayer = currentPlayer === 0 ? 1 : 0;
  }

  const losingScore = Math.min(scores[0], scores[1]);

  console.log("part 1: %d", losingScore * (nextRoll - 1));
};
