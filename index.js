const sum = (list, options = {}) => {
  // Ugly, but these are both optional independently
  if (!options.labels) {
    options.labels = [];
  }
  if (!options.i18n) {
    options.i18n = {};
  }

  doneWith = [];
  return list
    .reduce((acc, item, i, list) => {
      if (doneWith.includes(item)) {
        return acc;
      }

      const indices = list.reduce((acc, listItem, index) => {
        if (listItem === item) {
          acc.push(index);
        }
        return acc;
      }, []);
      // indices is now a list of indices that might include several ranges

      // [1, 2, 3] should become '1 to 3', in a way it's a extra sophisticated sumJoin.
      // We can get to have several ranges though, and those we'll want to sumjoin, so lets make this a step here.

      // I probably need to feed an ordered list of ranges per value, to enable
      // ["a", "a", "b", "a"] to be "1, 2 and 4: a" instead of "1 and 2 and 4: a"
      const rangeTexts = rangesToTexts(
        indicesToRanges(indices), options
      );

      doneWith.push(item);

      const sumJoinArgs = [
        rangeTexts,
        options.i18n['list-enum'],
        options.i18n['list-enum-last']
      ];
      const valueSeparator = options.i18n['value'] || ': ';

      return [...acc, `${sumJoin(...sumJoinArgs)}${valueSeparator}${item}`];
    }, [])
    .join(options.i18n['value-group'] ||", ");
};

const indicesToRanges = indices => {
  // [ 1, 2, 3 ] => [Range{from: 1, length: 3}] (=> "1 to 3")
  // [ 1 ] => [Range{from: 1, length: 1}] (=> "1")

  // Special case: Don't produce ranges of only two subsequent items.
  // Those are better summed up individual values
  // [ 1, 2 ] => [Range{from: 1, length: 1}, Range{from: 2, length: 1}] (=> "1, 2")

  let result = [];
  for (let i = 0; i < indices.length; i++) {
    const prevItem = indices[i - 1];
    const currentItem = indices[i];
    const nextItem = indices[i + 1];
    const currentRange = result[result.length - 1];
    const fitsRange = prevItem === currentItem - 1;

    // We want to avoid ranges with a length of 2.
    const completesValidRange =
      fitsRange && currentRange && currentRange.length >= 2;
    const buildsValidRange = fitsRange && prevItem === nextItem - 2;
    const validRange = completesValidRange || buildsValidRange;

    if (validRange) {
      currentRange.length++;
    } else {
      result.push({
        from: currentItem,
        length: 1
      });
    }
  }
  return result;
};

const rangesToTexts = (ranges, options) => {
  return ranges.map(
    range => {
      const from = range.from;
      const humanFrom = from + 1;
      const fromLabel = options.labels[from] || humanFrom;

      const to = range.from + range.length - 1;
      const humanTo = to + 1;
      const toLabel = options.labels[to] || humanTo;
      const rangeToString = options.i18n['range-to'] || ' to ';
      return range.length === 1
        ? `${fromLabel}`
        : `${fromLabel}${rangeToString}${toLabel}`
    }
  );
};

const sumJoin = (list, separator = ", ", lastSeparator = " and ") =>
  list
    .map((item, index, list) => {
      const isLast = index + 1 === list.length;
      const isSecondToLast = index + 2 === list.length;
      const usedSeparator = isLast
        ? ""
        : isSecondToLast
          ? lastSeparator
          : separator;
      return `${item}${usedSeparator}`;
    })
    .join("");

// console.log(sumJoin([1, 2, 3]));

// console.log(indicesToRanges([1, 2, 3])); // ["1 to 3"]

// const list3 = ['a', 'a', 'a'];

// console.log(sum(list3) === '1 to 3: a');

// const interrupted = ['a', 'b', 'a'];
// console.log(sum(interrupted) === '1 and 3: a, 2: b');

// ✅
console.log(sum(["a", "a", "a", "b"]) === "1 to 3: a, 4: b");
console.log(sum(["a", "b"]) === "1: a, 2: b");
console.log(sum(["a", "a"]) === "1 and 2: a");
console.log(sum(["a", "a", "b"]) === "1 and 2: a, 3: b");
console.log(sum(["a", "a", "b", "a"]) === "1, 2 and 4: a, 3: b");
console.log(sum(["a", "b", "c", "d"]) === "1: a, 2: b, 3: c, 4: d");
console.log(sum(["a", "b", "a", "b"]) === "1 and 3: a, 2 and 4: b");
console.log(sum(["a", "b", "a", "a", "a", "d", "d"]) === "1 and 3 to 5: a, 2: b, 6 and 7: d");
console.log(sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"]) === "1 and 3 to 5: a, 2: b, 6, 7 and 9: d, 8: e")

console.log(sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"], {
  i18n: {
    'list-enum': '، ',
    'list-enum-last': ' und ',
    'value': ' = ',
    'range-to': ' bis ',
    'value-group': '; '
  }
}) === "1 und 3 bis 5 = a; 2 = b; 6، 7 und 9 = d; 8 = e");

// console.log(sum([
//   "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
// ], { labels: [
//   "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
// }))

// console.log(sum([
//   "31 days",
//   "28 days",
//   "31 days",
//   "30 days",
//   "31 days",
//   "30 days",
//   "31 days",
//   "31 days",
//   "30 days",
//   "31 days",
//   "30 days",
//   "31 days"
// ], { labels: [
//   "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
// }))
