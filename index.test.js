const sum = require("./index").sum;

test("non-sum", () => {
  expect(sum(["a", "b"])).toBe("1: a. 2: b");
});

test("range and test", () => {
  expect(sum(["a", "a", "a", "b"])).toBe("1 to 3: a. 4: b");
});

test("short range as single values", () => {
  expect(sum(["a", "a"])).toBe("1 and 2: a");
});

test("short range as single values, rest", () => {
  expect(sum(["a", "a", "b"])).toBe("1 and 2: a. 3: b");
});

test("interrupted range", () => {
  expect(sum(["a", "a", "a", "b", "a"])).toBe("1 to 3 and 5: a. 4: b");
});

test("interrupted short range", () => {
  expect(sum(["a", "a", "b", "a"])).toBe("1, 2 and 4: a. 3: b");
});

test("repeated distinct values", () => {
  expect(sum(["a", "b", "a", "b"])).toBe("1 and 3: a. 2 and 4: b");
});

test("single occurance, range and rest", () => {
  expect(sum(["a", "b", "a", "a", "a", "d", "d"])).toBe(
    "1 and 3 to 5: a. 2: b. 6 and 7: d"
  );
});

test("multi group", () => {
  expect(sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"])).toBe(
    "1 and 3 to 5: a. 2: b. 6, 7 and 9: d. 8: e"
  );
});

test("with i18n", () => {
  expect(
    sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"], {
      i18n: {
        "list-enum": "، ",
        "list-enum-last": " und ",
        value: " = ",
        "range-to": " bis ",
        "value-group": "; "
      }
    })
  ).toBe("1 und 3 bis 5 = a; 2 = b; 6، 7 und 9 = d; 8 = e");
});

test("with labels", () => {
  expect(
    sum(["Twist", "Shout", "Shout", "Shout", "Twist", "Twist", "Shout"], {
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ]
    })
  ).toBe(
    "Monday, Friday and Saturday: Twist. Tuesday to Thursday and Sunday: Shout"
  );
});

test("with labels and touples format", () => {
  expect(
    sum([
      ["Monday", "Twist"],
      ["Tuesday", "Shout"],
      ["Wednesday", "Shout"],
      ["Thursday", "Shout"],
      ["Friday", "Twist"],
      ["Saturday", "Twist"],
      ["Sunday", "Shout"]
    ])
  ).toBe(
    "Monday, Friday and Saturday: Twist. Tuesday to Thursday and Sunday: Shout"
  );
});

test("without ranging", () => {
  expect(
    sum(["No Bones", "Bones", "Bones", "Bones", "Bones"], {
      labels: ["Bananas", "Humans", "Frogs", "Cats", "Fish"],
      ranging: false
    })
  ).toBe("Bananas: No Bones. Humans, Frogs, Cats and Fish: Bones");
});

test("without ranging, with touples format", () => {
  expect(
    sum(
      [
        ["Bananas", "No Bones"],
        ["Humans", "Bones"],
        ["Frogs", "Bones"],
        ["Cats", "Bones"],
        ["Fish", "Bones"]
      ],
      {
        ranging: false
      }
    )
  ).toBe("Bananas: No Bones. Humans, Frogs, Cats and Fish: Bones");
});

test("without ranging, with touples format, localized", () => {
  expect(
    sum(
      [
        ["🐼", "not monkey"],
        ["🙈", "monkey"],
        ["🙉", "monkey"],
        ["🙊", "monkey"],
        ["🦍", "monkey"]
      ],
      {
        ranging: false,
        i18n: {
          "list-enum": " & ",
          "list-enum-last": " as well as ",
          value: " is ",
          "value-group": " but "
        }
      }
    )
  ).toBe("🐼 is not monkey but 🙈 & 🙉 & 🙊 as well as 🦍 is monkey");
});

test("last value with own enum", () => {
  expect(
    sum([["🔴", "red"], ["🍏", "green"], ["👕", "blue"], ["🚕", "yellow"]], {
      ranging: false,
      i18n: {
        "value-group": "; "
      }
    })
  ).toBe("🔴: red; 🍏: green; 👕: blue; 🚕: yellow");
});
