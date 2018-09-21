const sum = list => {
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
      // let worry about making this into ranges later.
      // [1, 2, 3] should become '1 to 3', in a way it's a extra sophisticated sumJoin.
      // We can get to have several ranges though, and those we'll want to sumjoin, so lets make this a step here.

      const ranges = rangesToText(indicesToRanges(indices));

      doneWith.push(item);
      return [...acc, `${sumJoin(ranges)}: ${item}`];
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

const rangesToText = ranges => {
  return ranges.map(
    range =>
      range.length === 1
        ? `${range.from}`
        : range.length === 2
          ? `${range.from} and ${range.from + 1}`
          : `${range.from} to ${range.from + range.length - 1}`
  );
};
// console.log(rangesToText(indicesToRanges([1, 3, 4]))); ✅

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

// On this now
console.log(sum(["a", "a", "a", "b"])); //  === '1 to 3: a, 4: b'

// console.log(indicesToRanges([1, 2, 3])); // ["1 to 3"]

// const list3 = ['a', 'a', 'a'];

// console.log(sum(list3) === '1 to 3: a');

// const interrupted = ['a', 'b', 'a'];
// console.log(sum(interrupted) === '1 and 3: a, 2: b');

// ✅
// console.log(sum(['a', 'b']) === '1: a, 2: b');
// console.log(sum(['a', 'a', 'b']) === '1 and 2: a, 3: b');
// console.log(sum(['a', 'a', 'b', 'a']) === '1, 2 and 4: a, 3: b');
