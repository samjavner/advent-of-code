import _ from "lodash";
import fs from "fs";

type Diagnostic = number[];

const allDiagnostics = fs
  .readFileSync("day3/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map<Diagnostic>((n) => n.split("").map((b) => Number.parseInt(b)));

const getRate = (bits: number[]) => Number.parseInt(bits.join(""), 2);

const getOnesCount = (
  index: number,
  diagnostics: Diagnostic[] = allDiagnostics
) =>
  _(diagnostics)
    .map((d) => d[index])
    .sum();

// PART 1

const getPowerConsumption = () => {
  const onesCounts = _.chain(0)
    .range(allDiagnostics[0].length)
    .map((index) => getOnesCount(index))
    .value();

  const gammaBits = onesCounts.map((count) =>
    count > allDiagnostics.length / 2 ? 1 : 0
  );

  const epsilonBits = onesCounts.map((count) =>
    count > allDiagnostics.length / 2 ? 0 : 1
  );

  const gammaRate = getRate(gammaBits);
  const epsilonRate = getRate(epsilonBits);

  return gammaRate * epsilonRate;
};

console.log("part 1: %d", getPowerConsumption());

// PART 2

const getBitCriteriaRating =
  (mode: "most" | "least", index = 0) =>
  (diagnostics: Diagnostic[]): number => {
    const onesCount = getOnesCount(index, diagnostics);

    const bitCriteria =
      onesCount >= diagnostics.length / 2
        ? mode === "most"
          ? 1
          : 0
        : mode === "most"
        ? 0
        : 1;

    const relevantDiagnostics = diagnostics.filter(
      (d) => d[index] === bitCriteria
    );

    return relevantDiagnostics.length === 1
      ? getRate(relevantDiagnostics[0])
      : getBitCriteriaRating(mode, index + 1)(relevantDiagnostics);
  };

const getLifeSupportRating = () => {
  const getOxygenGeneratorRating = getBitCriteriaRating("most");
  const getCo2ScrubberRating = getBitCriteriaRating("least");

  const oxygenGeneratorRating = getOxygenGeneratorRating(allDiagnostics);
  const co2ScrubberRating = getCo2ScrubberRating(allDiagnostics);

  return oxygenGeneratorRating * co2ScrubberRating;
};

console.log("part 2: %d", getLifeSupportRating());
