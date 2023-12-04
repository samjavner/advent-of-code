import fs from "fs";
import { objectify, sum } from "radash";

const cards = fs
  .readFileSync("day4/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((card) => {
    const [cardN, numbers] = card.split(": ");
    const n = cardN.slice(cardN.lastIndexOf(" ") + 1);
    const [winningNumbers, numbersOnCard] = numbers.split(" | ");

    return {
      number: Number(n),
      winningNumbers: winningNumbers
        .split(" ")
        .filter((x) => x)
        .map((x) => Number(x)),
      numbers: numbersOnCard
        .split(" ")
        .filter((x) => x)
        .map((x) => Number(x)),
    };
  });

const part1 = sum(
  cards
    .map(
      (card) =>
        card.winningNumbers.filter((n) => card.numbers.includes(n)).length
    )
    .map((n) => (n === 0 ? 0 : Math.pow(2, n - 1)))
);

console.log("part 1: %d", part1);

const cardCount = objectify(
  cards,
  (card) => card.number,
  () => 1
);

for (const card of cards) {
  const matchingNumberCount = card.winningNumbers.filter((n) =>
    card.numbers.includes(n)
  ).length;

  for (let n = 0; n < matchingNumberCount; n += 1) {
    cardCount[card.number + n + 1] += cardCount[card.number];
  }
}

const part2 = sum(Object.values(cardCount));

console.log("part 1: %d", part2);
