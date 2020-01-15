## Compiler Config

| Option | Description | Example | Available since |
| ------ | ----------- | ------- | --------------- |
| `functions` | Inject native-function written in JS / TS to manipulate the result | See [custom functions](docs/syntax.md#native-functions) | [0.0.11](../../releases/tag/0.0.11) |
| `locationData` | Apply location properties to each object | See [location data](#locationdata) | [0.0.12](../../releases/tag/0.0.12) |

### `locationData`
If set to `true` or a definition object it will assign two additional properties to each object which specify the start and 
end -position of the matched type.

```js
const parse = compile(`
    entry [object:
        '(' 
        def foo = [object:
            def content = [(a - z)+]
        ]
        ')'
    ]
`, {
    locationData: true
});

console.log(parse('(abcdef)'));

```

The snipped above would log the following:
```json
{
    "foo": { 
        "content": "abcdef", 
        "__starts": 1, 
        "__ends": 6 
    },
    "__starts": 0,
    "__ends": 7
}
```

It's also possible to use an object as value to customize the propertie-names:

```js
const option = {
    locationData: {
        start: 'startsAt',
        end: 'endsAt'
    }
}
```
