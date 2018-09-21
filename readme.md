# Summarize

Summarize takes a list of things, and summarizes it like humans tend to do it.

Here's an example of some calendar data
```js
sum([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
])
```
Becomes `1 to 5: Work, 6 and 7: Weekend`.

It can also be configured with labels for what positions in the list stand for.

```js
sum([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
})
```
Becomes `Monday to Friday: Work, Saturday and Sunday: Weekend`.

Or how about a little fancier?

```js
sum([
  "Twist", "Shout", "Shout", "Shout", "Twist", "Twist", "Shout"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
})
```
Becomes `Monday, Friday and Saturday: Twist, Tuesday to Thursday and Sunday: Shout`.

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
becomes `January, March, May, July, August, October and December: 31 days, February: 28 days, April, June, September and November: 30 days`.

Ranges and single values can be mixed and the output will still be summarized efficiently:
```js
sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"]));
```
Becomes `"1 and 3 to 5: a, 2: b, 6, 7 and 9: d, 8: e"`

## Formatting options

To enable localization and probably some different use cases, the different separators and range keywords can be customized.

```js
sum(["a", "b", "a", "a", "a", "d", "d", "e", "d"], {
  i18n: {
    'list-enum': '، ',
    'list-enum-last': ' und ',
    'value': ' = ',
    'range-to': ' bis ',
    'value-group': '; '
  }
}));
```
Becomes `"1 und 3 bis 5 = a; 2 = b; 6، 7 und 9 = d; 8 = e"`

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
    'value-group': '. '
  },
  ranging: false,
})
```
Becomes `"Bananas: No Bones. Humans, Frogs, Cats and Fish: Bones"`







Another way of summing up is by using more specific units / ranges.
Maybe those would need to be defined with the value though?

```js
sum([
  ['8:45 am', 'Getting to work'],
  ['9 am', 'Work'],
  ['12 pm,', 'Lunch'],
  ['12:30 pm,', 'Work'],
  ['5:30 pm,', 'Getting home']
])
```
but right now the definition would be like this

```js
sum([
  'Getting to work',
  'Work',
  'Lunch',
  'Work',
  'Getting home'
], {labels: ['8:45 am', '9 am', '12 pm', '12:30 pm', '5:30 pm']})
```
becomes `8:45 am: Getting to work, 9 am and 12:30 pm: Work, 12 pm: Lunch, 5:30 pm: Getting home`

That doesn't make too much sense. This is probably a different use case.
Maybe output like
`8:45 - 9am: Getting to work, 9 am to 12:30 pm: Work, 12 pm: Lunch, 12 to 5:30 pm: Work, 5:30 pm: Getting home` is more desirable. Kind of a different problem.