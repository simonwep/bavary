## Compiler Config

| Option | Description | Example | Available since |
| ------ | ----------- | ------- | --------------- |
| `functions` | Inject custom-function written in JS / TS to manipulate the result | See [custom functions](#custom-functions) | [0.0.11](../../releases/tag/0.0.11) |


### Custom Functions
Custom functions are used to directly manipulate the result of your parser.
Let's create one which counts the amount of characters of a group and saves the result into a property.

##### Our source code
Let's create a simple set of definitions which will later be used to count how many numbers where matched between two brackets:

```html
entry [
    '(' count([(0 - 9)+], 'length') ')'
]
```

As we can see we're calling a function with a group `[(0 - 9)+]` as first argument, and a raw string `length` as second one where the
amount of numbers should later be stored.

Let's compile it and implement the `count` function:
```js
const parse = compile(`
    entry ['(' count([(0 - 9)+], 'length') ')']
`, {
    functions: {

        // Our count function
        count({setProperty}, value, prop) {

            // Validate result of group.
            // Bavary will automatically resolve any groups / references passed into the arguments list
            if (!value || typeof value !== 'string') {
                throw 'Group not matched or not a string.';
            }

            // Let's validate the tag
            if (typeof prop !== 'string') {
                throw 'Second argument must be a string.';
            }

            // Use setProperty to save the length of the matched string
            setProperty(prop, value.length);

            // Everything went fine.
            return true;
        }
    }
});
```

Ok, lets take a closer look how a custom function is build:
```ts
count(actions: ParserActions, ...args: object | string): boolean
```

1. The first argument (`ParserActions`) contains a set of functions to manipulate the result:  
  1.1 `setProperty(key: string, value: any)` _- Defines a property in the result object. The first argument is the key, the second a value._  
  1.2 `setString(str: tring)` _- If the current group returns a string (e.g. contains no tags) you can update it via this function.
  Once a result is an object it's not possible anymore to update the source string._  
  1.3 `value: ParsingResult` _- Reference to the current result, should only be used to access matched tags._
2. Every subsequent argument is one argument passed into the function.

The function should return a `boolean` whenever everything went fine.
On `false` the parent-group will return `null` e.g. fail.

A custom function accepts [groups](./syntax.md#group-definition), tags (`#tag`: reference to the tag property) or raw strings (`'Hello World'`).
