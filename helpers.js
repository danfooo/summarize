const indicesToRanges = indices => {
  let result = [];
  for (let i = 0; i < indices.length; i++) {
    const currentRange = result[result.length - 1];

    const prevItem = indices[i - 1];
    const currentItem = indices[i];
    const fitsRange = prevItem === currentItem - 1;

    // Don't produce ranges of only two subsequent items.
    // Those sound better when summed up as individual values.
    const nextItem = indices[i + 1];
    const completesValidRange =
      fitsRange && currentRange && currentRange.length >= 2;
    const buildsValidRange = fitsRange && currentItem === nextItem - 1;
    const inCurrentRange = completesValidRange || buildsValidRange;

    if (inCurrentRange) {
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

const rangesToTexts = (ranges, options = {}) => {
  // Can't do these with default, they're optional independently
  if (!options.labels) {
    options.labels = [];
  }
  if (!options.i18n) {
    options.i18n = {};
  }

  return ranges.map(range => {
    const from = range.from;
    const humanFrom = from + 1;
    const fromLabel = options.labels[from] || humanFrom;

    const to = range.from + range.length - 1;
    const humanTo = to + 1;
    const toLabel = options.labels[to] || humanTo;
    const rangeToString = options.i18n["range-to"] || " to ";
    return range.length === 1
      ? `${fromLabel}`
      : `${fromLabel}${rangeToString}${toLabel}`;
  });
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

module.exports = {
  indicesToRanges,
  rangesToTexts,
  sumJoin
};
