import _ from "lodash";
import fs from "fs";

type Square =
  | {
      type: "unmarked";
      value: number;
    }
  | {
      type: "marked";
      value: number;
    };

type Board = Square[][];

type GameState =
  | {
      type: "play_on";
      boards: Board[];
    }
  | {
      type: "winner";
      board: Board;
      score: number;
    };

interface GameRules {
  isGameWon: (boards: Board[], lastDraw: number) => [Board, number] | undefined;
  eliminateLosers: (boards: Board[]) => Board[];
}

const lines = fs
  .readFileSync("day4/input.txt", "utf8")
  .split("\n")
  .filter((n) => n);

const draws = lines[0].split(",").map((n) => Number.parseInt(n));

const emptyBoards: Board[] = _(lines.slice(1))
  .map((row) =>
    row
      .split(" ")
      .filter((n) => n)
      .map<Square>((n) => ({ type: "unmarked", value: Number.parseInt(n) }))
  )
  .chunk(5)
  .value();

const isWinningBoard = (board: Board): boolean => {
  const indexes = _.range(0, board.length);

  return (
    indexes.some((row) =>
      indexes.every((col) => board[row][col].type === "marked")
    ) ||
    indexes.some((col) =>
      indexes.every((row) => board[row][col].type === "marked")
    )
  );
};

const getScore = (board: Board, lastDraw: number): number =>
  lastDraw *
  _(board)
    .map((row) =>
      _(row)
        .filter((square) => square.type === "unmarked")
        .map(({ value }) => value)
        .sum()
    )
    .sum();

const markBoard = (board: Board, draw: number): Board =>
  board.map((row) =>
    row.map((square) =>
      square.value === draw ? { type: "marked", value: square.value } : square
    )
  );

const markBoards = (boards: Board[], draw: number): Board[] =>
  boards.map((board) => markBoard(board, draw));

const playRound =
  (rules: GameRules) =>
  (boards: Board[], draw: number): GameState => {
    const newBoards = markBoards(boards, draw);
    const gameWinner = rules.isGameWon(newBoards, draw);

    return gameWinner
      ? {
          type: "winner",
          board: gameWinner[0],
          score: gameWinner[1],
        }
      : {
          type: "play_on",
          boards: rules.eliminateLosers(newBoards),
        };
  };

const playGame =
  (rules: GameRules) =>
  (boards: Board[], draws: number[]): GameState =>
    draws.reduce<GameState>(
      (gameState, draw) =>
        gameState.type === "winner"
          ? gameState
          : playRound(rules)(gameState.boards, draw),
      { type: "play_on", boards }
    );

const rulesPart1: GameRules = {
  isGameWon: (boards, lastDraw) =>
    _(boards)
      .filter(isWinningBoard)
      .map<[Board, number]>((board) => [board, getScore(board, lastDraw)])
      .maxBy(([_, score]) => score),
  eliminateLosers: (boards) => boards,
};

const rulesPart2: GameRules = {
  isGameWon: (boards, lastDraw) =>
    boards.every(isWinningBoard)
      ? _(boards)
          .map<[Board, number]>((board) => [board, getScore(board, lastDraw)])
          .minBy(([_, score]) => score)
      : undefined,
  eliminateLosers: (boards) => boards.filter(_.negate(isWinningBoard)),
};

console.log("part 1: %o", playGame(rulesPart1)(emptyBoards, draws));
console.log("part 2: %o", playGame(rulesPart2)(emptyBoards, draws));
