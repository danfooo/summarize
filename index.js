const sum = (list, options = {labels: []}) => {
  doneWith = [];
  return list
    .reduce((acc, item, i, list) => {
      if (doneWith.includes(item)) {
        return acc;
      }

      const indices = list.reduce((acc, listItem, index) => {
        if (listItem === item) {
          acc.push(index + 1);
        }
        return acc;
      }, []);
      // indices is now a list of indices that might include several ranges

      // [1, 2, 3] should become '1 to 3', in a way it's a extra sophisticated sumJoin.
      // We can get to have several ranges though, and those we'll want to sumjoin, so lets make this a step here.

      // I probably need to feed an ordered list of ranges per value, to enable
      // ["a", "a", "b", "a"] to be "1, 2 and 4: a" instead of "1 and 2 and 4: a"
      const rangeTexts = rangesToTexts(
        indicesToRangesWithMinLengthThree(indices), options
      );

      doneWith.push(item);
      return [...acc, `${sumJoin(rangeTexts)}: ${item}`];
    }, [])
    .join(", ");
};

const indicesToRanges = indices => {
  // [ 1, 2, 3 ] => [Range{from: 1, length: 3}] => ["1 to 3"]
  // [ 1 ] => [Range{from: 1, length: 1}] => ["1"]
  // [ 1, 3, 4 ] => [Range{from: 1, length: 1}, Range{from: 3, length: 2}] => ["1", "3 and 4"]

  let result = [];
  let lastItem;
  let currentItem;
  for (let i = 0; i < indices.length; i++) {
    currentItem = indices[i];
    const fitsRange = lastItem === currentItem - 1;
    if (fitsRange) {
      result[result.length - 1].length++;
    } else {
      result.push({
        from: currentItem,
        length: 1
      });
    }

    lastItem = currentItem;
  }
  return result;
};

const indicesToRangesWithMinLengthThree = indices => {
  // [ 1, 2, 3 ] => [Range{from: 1, length: 3}] (=> "1 to 3")
  // [ 1 ] => [Range{from: 1, length: 1}] (=> "1")
  // [ 1, 2 ] => [Range{from: 1, length: 1}, Range{from: 2, length: 1}] (=> "1, 2")

  let result = [];
  for (let i = 0; i < indices.length; i++) {
    const prevItem = indices[i - 1];
    const currentItem = indices[i];
    const nextItem = indices[i + 1];
    const currentRange = result[result.length - 1];
    const fitsRange = prevItem === currentItem - 1;
    // console.log({ prevItem, currentItem, nextItem });

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
      const fromLabel = options.labels[range.from] || range.from;
      const to = range.from + range.length - 1;
      const toLabel = options.labels[to] || to;
      return range.length === 1
        ? `${fromLabel}`
        : `${fromLabel} to ${toLabel}`
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
// console.log(sum(["a", "a", "a", "b"]) === "1 to 3: a, 4: b");
// console.log(sum(["a", "b"]) === "1: a, 2: b");
// console.log(sum(["a", "a", "b"]) === "1 and 2: a, 3: b");
// console.log(sum(["a", "a", "b", "a"]) === "1, 2 and 4: a, 3: b");
// console.log(sum(["a", "b", "c", "d"]) === "1: a, 2: b, 3: c, 4: d");
// console.log(sum(["a", "b", "a", "b"]) === "1 and 3: a, 2 and 4: b");

console.log(sum([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
}))


