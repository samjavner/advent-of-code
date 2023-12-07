import fs from "fs";
import { counting, max, sort, sum } from "radash";

type Game = Hand[];

interface Hand {
  cards: Cards;
  bid: number;
}

type Cards = [Card, Card, Card, Card, Card];

type Card =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";

const cardNumber = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function getStrength(cards: Cards, isJokerWild: boolean = false): number {
  const type = getType(cards, isJokerWild);

  return [
    type,
    ...cards.map((card) =>
      isJokerWild && card === "J" ? 1 : cardNumber[card]
    ),
  ].reduce((previous, current) => previous * 100 + current, 0);
}

function getType(cards: Cards, isJokerWild: boolean): number {
  const counts = counting(cards, (card) => card);

  if (isJokerWild && counts.J) {
    const { J: jokerCount, ...otherCardCounts } = counts;

    const maxCardCount = max(Object.values(otherCardCounts));
    const maxCard = (Object.keys(otherCardCounts) as Exclude<Card, "J">[]).find(
      (card) => otherCardCounts[card] === maxCardCount
    );

    if (maxCard) {
      delete (counts as any).J;
      counts[maxCard] += jokerCount;
    }
  }

  const uniqueCards = Object.keys(counts) as Card[];
  const cardCounts = Object.values(counts);

  switch (uniqueCards.length) {
    case 1:
      // five of a kind
      return 7;
    case 2:
      // four of a kind or full house
      return cardCounts.includes(4) ? 6 : 5;
    case 3:
      // three of a kind or two pair
      return cardCounts.includes(3) ? 4 : 3;
    case 4:
      // one pair
      return 2;
    case 5:
      // high card
      return 1;
    default:
      throw new Error();
  }
}

const game: Game = fs
  .readFileSync("day7/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => {
    const [hand, bid] = x.split(" ");
    return {
      cards: hand.split("") as Cards,
      bid: Number(bid),
    };
  });

const ranked1 = sort(
  game.map((hand) => ({ hand, strength: getStrength(hand.cards) })),
  ({ strength }) => strength
);

const part1 = sum(ranked1.map(({ hand }, index) => hand.bid * (index + 1)));

console.log("part 1: %d", part1);

const ranked2 = sort(
  game.map((hand) => ({ hand, strength: getStrength(hand.cards, true) })),
  ({ strength }) => strength
);

const part2 = sum(ranked2.map(({ hand }, index) => hand.bid * (index + 1)));

console.log("part 2: %d", part2);
