export type Bit = 0 | 1;

export interface Success<T> {
  remaining: Bit[];
  parsed: Bit[];
  value: T;
}

export type Parser<T> = (input: Bit[]) => Success<T> | undefined;

export const sequence =
  <P extends [...Parser<any>[]], T>(
    parsers: [...P],
    getValue: (
      ...results: { [I in keyof P]: P[I] extends Parser<infer U> ? U : never }
    ) => T
  ): Parser<T> =>
  (input) => {
    const results = [];
    let remaining = input;
    const parsed: Bit[] = [];

    for (const parser of parsers) {
      const result = parser(remaining);

      if (!result) {
        return undefined;
      }

      results.push(result);
      remaining = result.remaining;
      parsed.push(...result.parsed);
    }

    return {
      parsed,
      remaining,
      value: getValue(...(results.map((result) => result.value) as any)),
    };
  };

export const alternative =
  <P extends [...Parser<any>[]]>(
    ...parsers: [...P]
  ): Parser<
    { [I in keyof P]: P[I] extends Parser<infer U> ? U : never }[number]
  > =>
  (input) => {
    for (const parser of parsers) {
      const result = parser(input);
      if (result) {
        return result;
      }
    }
  };

export const num =
  (digits: number): Parser<number> =>
  (input) => {
    if (input.length >= digits) {
      return {
        parsed: input.slice(0, digits),
        remaining: input.slice(digits),
        value: Number.parseInt(input.slice(0, digits).join(""), 2),
      };
    }
  };
