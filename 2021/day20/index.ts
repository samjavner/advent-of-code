import fs from "fs";
import _ from "lodash";

type Algorithm = boolean[];
type Image = [pixels: boolean[][], bg: boolean];

const input = fs.readFileSync("day20/input.txt", "utf8").split("\n\n");

const algorithm: Algorithm = input[0].split("").map((p) => p === "#");

const initialImage: Image = [
  input[1]
    .split("\n")
    .filter((n) => n)
    .map((n) => n.split("").map((p) => p === "#")),
  false,
];

const extend = ([pixels, bg]: Image): Image => {
  const emptyRow = new Array(pixels[0].length + 2)
    .fill(undefined)
    .map((_) => bg);

  return [[emptyRow, ...pixels.map((row) => [bg, ...row, bg]), emptyRow], bg];
};

const enhancePixel = ([pixels, bg]: Image, x: number, y: number): boolean => {
  const neighbors = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  const index = Number.parseInt(
    neighbors.map(([px, py]) => (pixels[py]?.[px] ?? bg ? "1" : "0")).join(""),
    2
  );

  return algorithm[index];
};

const enhance = (image: Image): Image => {
  const [input, inputBg] = extend(image);
  const output = input.map((row) => [...row]);
  const outputBg = inputBg ? algorithm[511] : algorithm[0];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      output[y][x] = enhancePixel([input, inputBg], x, y);
    }
  }

  return [output, outputBg];
};

const enhanceN = (n: number): Image =>
  _.range(0, n).reduce(enhance, initialImage);

const getLitPixelCount = ([pixels, bg]: Image): number | undefined => {
  return bg
    ? undefined
    : _(pixels)
        .map((row) =>
          _(row)
            .map((p) => (p ? 1 : 0))
            .sum()
        )
        .sum();
};

console.log("part 1: %d", getLitPixelCount(enhanceN(2)));
console.log("part 2: %d", getLitPixelCount(enhanceN(50)));
