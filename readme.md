# Summarize

Summarize takes a list of things, and summarizes it like humans tend to do it.

Here's an example of some calendar data
```js
sum([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
])
```
Becomes `1 to 5: Work. 6 and 7: Weekend`.

It can also be configured with labels for what positions in the list stand for.

```js
sum([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
})
```
Becomes `Monday to Friday: Work. Saturday and Sunday: Weekend`.

It work for more scattered occurences of data too:

```js
sum([
  "Twist", "Shout", "Shout", "Shout", "Twist", "Twist", "Shout"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
})
```
Becomes `Monday, Friday and Saturday: Twist. Tuesday to Thursday and Sunday: Shout`.

This works well for other time based lists too:

```js
sum([
  "31 days",
  "28 days",
  "31 days",
  "30 days",
  "31 days",
  "30 days",
  "31 days",
  "31 days",
  "30 days",
  "31 days",
  "30 days",
  "31 days"
], { labels: [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
})
```
becomes `January, March, May, July, August, October and December: 31 days. February: 28 days, April, June, September and November: 30 days`.

Ranges and single values can be mixed and the output will still be summarized efficiently:
```js
sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"]));
```
Becomes `"1 and 3 to 5: a. 2: b, 6, 7 and 9: d. 8: e"`

## Formatting options

The different separators and range keywords can be customized.

```js
sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"], {
  i18n: {
    "list-enum": "، ",
    "list-enum-last": " und ",
    value: " ist ",
    "range-to": " bis ",
    "list-group-enum": "; ",
    "list-group-enum-last": " und übrigens, "
  }
}));
```
Becomes `"1 und 3 bis 5 ist a; 2 ist b; 6، 7 und 9 ist d und übrigens, 8 ist e"`

# Unranged use cases

If your list is actually not in any particular order, you can also turn ranging off and still sumarize anyway.

```js
sum([
  "No Bones", "Bones", "Bones", "Bones"
], {
  labels: [
    "Bananas", "Humans", "Frogs", "Cats", "Fish"
  ],
  i18n: {
    'list-group-enum': '. '
  },
  ranging: false,
});
```
Becomes `"Bananas: No Bones. Humans, Frogs, Cats and Fish: Bones"`

You can provide the list in a different format:
```js
sum([
  ["Bananas", "No Bones"],
  ["Humans", "Bones"],
  ["Frogs", "Bones"],
  ["Cats", "Bones"],
  ["Fish", "Bones"],
], {
  ranging: false,
});
```
