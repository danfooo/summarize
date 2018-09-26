const indicesToRanges = require("./helpers").indicesToRanges;
const rangesToTexts = require("./helpers").rangesToTexts;
const sumJoin = require("./helpers").sumJoin;

const sum = (list, options = {}) => {
  // Can't do these with default, they're optional independently
  if (!options.labels) {
    options.labels = [];
  }
  if (!options.i18n) {
    options.i18n = {};
  }
  if (options.ranging === undefined) {
    options.ranging = true;
  }

  let _list = list;
  if (Array.isArray(list[0])) {
    _list = list.map(touple => touple[1]);
    options.labels = list.map(touple => touple[0]);
  }

  doneWith = [];
  const groups = _list.reduce((acc, item, i, list) => {
    if (doneWith.includes(item)) {
      return acc;
    }

    const indices = list.reduce((acc, listItem, index) => {
      if (listItem === item) {
        acc.push(index);
      }
      return acc;
    }, []);

    const ranges = options.ranging
      ? indicesToRanges(indices)
      : indices.map(index => ({
          from: index,
          length: 1
        }));
    const rangeTexts = rangesToTexts(ranges, options);

    doneWith.push(item);

    const sumJoinArgs = [
      rangeTexts,
      options.i18n["list-enum"],
      options.i18n["list-enum-last"]
    ];
    const valueSeparator = options.i18n["value"] || ": ";

    return [...acc, `${sumJoin(...sumJoinArgs)}${valueSeparator}${item}`];
  }, []);

  return sumJoin(
    groups,
    options.i18n["list-group-enum"] || ". ",
    options.i18n["list-group-enum-last"] ||
      options.i18n["list-group-enum"] ||
      ". "
  );
};

// console.log(sumJoin([1, 2, 3]));

// console.log(indicesToRanges([1, 2, 3])); // ["1 to 3"]

// const list3 = ['a', 'a', 'a'];

// console.log(sum(list3) === '1 to 3: a');

// const interrupted = ['a', 'b', 'a'];
// console.log(sum(interrupted) === '1 and 3: a, 2: b');

module.exports = {
  sum
};
