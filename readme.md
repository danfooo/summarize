# Summarize

Summarize takes a list of things, and summarizes it like humans tend to do it.

Here's an example of some calendar data
```js
summarize([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
])
```
Becomes `1 to 5: Work, 6 and 7: Weekend`.

It can also be configured with labels for what positions in the list stand for.

```js
summarize([
  "Work", "Work", "Work", "Work", "Work", "Weekend", "Weekend"
], { labels: [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
})
```
Becomes `Monday to Friday: Work, Saturday and Sunday: Weekend`.

While this example is a pretty simple job to sum up, here's a tougher one.

```js
summarize([
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