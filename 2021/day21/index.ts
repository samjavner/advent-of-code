import fs from "fs";
import part1 from "./part1";
import part2 from "./part2";

const [s1, s2] = fs
  .readFileSync("day21/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) =>
    Number.parseInt(/^Player \d+ starting position: (\d+)$/.exec(n)![1])
  );

part1(s1, s2);
part2(s1, s2);
