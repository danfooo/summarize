const indicesToRanges = require("./helpers").indicesToRanges;
const rangesToTexts = require("./helpers").rangesToTexts;
const sumJoin = require("./helpers").sumJoin;

describe("indicesToRanges", () => {
  test("two subsequent", () => {
    expect(indicesToRanges([1, 2])).toEqual([
      { from: 1, length: 1 },
      { from: 2, length: 1 }
    ]);
  });

  test("many subsequent", () => {
    expect(indicesToRanges([1, 2, 3])).toEqual([{ from: 1, length: 3 }]);
  });

  test("mixed", () => {
    expect(indicesToRanges([1, 3, 4, 5, 6, 8, 9, 11, 12, 13])).toEqual([
      { from: 1, length: 1 },
      { from: 3, length: 4 },
      { from: 8, length: 1 },
      { from: 9, length: 1 },
      { from: 11, length: 3 }
    ]);
  });
});

describe("rangesToTexts", () => {
  test("single value", () => {
    expect(rangesToTexts([{ from: 0, length: 1 }])).toEqual(["1"]);
  });

  test("single values", () => {
    expect(
      rangesToTexts([{ from: 0, length: 1 }, { from: 1, length: 1 }])
    ).toEqual(["1", "2"]);
  });

  test("range", () => {
    expect(rangesToTexts([{ from: 0, length: 3 }])).toEqual(["1 to 3"]);
  });

  test("ranges", () => {
    expect(
      rangesToTexts([{ from: 0, length: 3 }, { from: 3, length: 3 }])
    ).toEqual(["1 to 3", "4 to 6"]);
  });

  test("mixed", () => {
    expect(
      rangesToTexts([
        { from: 0, length: 1 },
        { from: 1, length: 1 },
        { from: 2, length: 1 },
        { from: 3, length: 3 }
      ])
    ).toEqual(["1", "2", "3", "4 to 6"]);
  });

  test("with labels", () => {
    expect(
      rangesToTexts(
        [
          { from: 0, length: 1 },
          { from: 1, length: 1 },
          { from: 2, length: 1 },
          { from: 3, length: 3 }
        ],
        { labels: ["a", "b", "c", "d", "e", "f"] }
      )
    ).toEqual(["a", "b", "c", "d to f"]);
  });

  test("with i18n", () => {
    expect(
      rangesToTexts(
        [
          { from: 0, length: 1 },
          { from: 1, length: 1 },
          { from: 2, length: 1 },
          { from: 3, length: 3 }
        ],
        {
          i18n: {
            "range-to": " – "
          }
        }
      )
    ).toEqual(["1", "2", "3", "4 – 6"]);
  });

  test("with i18n and labels", () => {
    expect(
      rangesToTexts(
        [
          { from: 0, length: 1 },
          { from: 1, length: 1 },
          { from: 2, length: 1 },
          { from: 3, length: 3 }
        ],
        {
          labels: ["a", "b", "c", "d", "e", "f"],
          i18n: {
            "range-to": " – "
          }
        }
      )
    ).toEqual(["a", "b", "c", "d – f"]);
  });
});

describe("sumjoin", () => {
  test("two", () => {
    expect(sumJoin(["a", "b"])).toBe("a and b");
  });

  test("many", () => {
    expect(sumJoin(["a", "b", "c", "d"])).toBe("a, b, c and d");
  });

  test("two with custom separator", () => {
    expect(sumJoin(["a", "b"], null, " – ")).toBe("a – b");
  });

  test("many with custom separators", () => {
    expect(sumJoin(["a", "b", "c", "d"], " & ", "; ")).toBe("a & b & c; d");
  });
});
