## Compiler Config

| Option | Description | Example | Available since |
| ------ | ----------- | ------- | --------------- |
| `functions` | Inject native-function written in JS / TS to manipulate the result | See [custom functions](docs/syntax.md#native-functions) | [0.0.11](../../releases/tag/0.0.11) |
| `locationData` | Apply location properties to each object | See [location data](#location-data) | [0.0.12](../../releases/tag/0.0.12) |

### Location Data
If set to `true` or a definition object it will assign two additional properties to each object which specify the start and 
end -position of the matched type.

```js
const parse = compile(`
    <num> = [(0 - 9)+]
    <char> = [(a - z)+]

    // The following type <foo> will return an object where the option
    // locationData will have an effect.
    <foo> = [<num#num> <char#char>]
    entry ['(' <foo#abc> ')']
`, {
    locationData: true
});

console.log(parse('(123aabbcc)'));
```

The snipped above would log the following:
```json
{
  "abc": {
    "num": "123",
    "char": "aabbcc",
    "__starts": 1,
    "__ends": 9
  }
}
```

It's also possible to use an object as option-value to customize the properties:

```js
const option = {
    locationData: {
        start: 'startsAt',
        end: 'endsAt'
    }
}
```
