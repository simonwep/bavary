> Before you start - you can also checkout [examples](examples) directly!

### Content
1. [Comments](#comments) _- Everything should be properly documented, especially parser._

2. [Entry type](#entry-type) _- Each parser starts with it._

3. [Character selection](#character-selection) _- Core concept: character ranges._  
   3.1 [Common tokens](#common-tokens) _- Regexp escape-sequences_

4. [Groups](#groups) _- Group related items together._  
   4.1 [Multipliers](#multipliers) _- How (and how often) things should matched._
   4.2 [Combinators](#combinators) _- Logical relationship between matcher._
   4.3 [String group](#string-group) _- A group to match and return strings._
   4.4 [Array group](#array-group) _- A group which returns an array._
   4.5 [Object group](#object-group) _- A group which returns an object._
   4.6 [Operators](#operators) _- Manipulate the current state of a group._

5. [Types](#types) _- Reusable, independent, named [group](#groups)._  
   5.1 [Spread operator](#spread-operator) _- Let the result, array or object, from a [type](#types) bubble up._  
   5.2 [Arguments](#arguments) _- Pass groups to [types](#types)._

6. [Blocks](#block-definition) _- Give [types](#types) a scope and group related stuff together_.

7. [Conditional statements](#conditional-statements) _- Parse by condition._  
   7.1 [Logical operators](#logical-operators) _- As the name already says..._
   7.2 [Constants](#constants) _- Constants for values to use within conditional-statements._

### Comments
There are two ways to make comments (The same ways as in JS):

> Single-line comments
```
// Hi! This is a single-line comment :)
```

> Multi-line comments
```
/*
 * Multi-line comments are useful to write larger parts of documentation!
 */
```

### Entry type
Each parser consists of exactly **one** `entry` type followed by a named (or anonymous) [type declaration](#type-definition) **or**
a [block](#block-definition) definition where the default export will be used. The entry value is where everything starts:

```html
// A entry group
entry ['A']

/* A entry block
 * The default export will be used, in this case ['AB']
 */
entry {
	default ['AB']
}
```


### Character selection
Character-selection works almost the same as in regular expressions, only the syntax is a bit different:

| Name | Description | Example |
| ---- | ----------- | ------- |
| Single Character | Matches exactly the given character. | `'A'` |
| Hex character  | Matches the 16-bit character with the given hex value. | `\x0f` `\xfa15` |
| Octal character  | Matches the 8-bit character with the given octal value. | `\45` `\167` |
| Character range | Matches every character between two anchor-chars. | `(a - z)` |
| Character range with excluded characters | Excludes a character-range or single characters. | `(a - z except g, h)`  |

Let's look at a few examples:

| Example                     | Explanation                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `(a - z)`                   | Matches all characters from `a` to `z`.                      |
| `(a - c, h, u)`             | Matches characters from `a` to `c` and additionally `h` and `u`. You can use a `,` to define multiple ranges or to choose more characters. |
| `(a - z except j - p, 'z')` | Matches all characters from `a` to `z` except the range `j` to `p` and the character `z`. You can wrap characters, escape-sequences and punctuation-characters in quotation marks. |

Character selection could also have [multipliers](#multipliers) attached to it, for example `(a - z, except d - g, z){4, 7}`: Matches all characters between `a` and `z` except `d` -`g` and the character `z`
*4 to 7 times*.

**All punctuation characters** need to be escaped: `(\- - \+)` (`-` to `+`) / `(\\\n - \t)` (`\n` to `\t`, line-breaks need to be escaped too). Even better: Wrap them into quotation-marks since `\` is normally used for tokens (see below).

You can use a sub-set of common-tokens used in regex to avoid rewriting commonly used sequences, this way you can save a bit extra-code:

#### Common tokens

| Token | Description | Example |
| ----- | ----------- | ------- |
| `.` | Stands for anything, can be used to reverse-select characters. | `(. except \d)` |
| `\t` | Tab character. | `(\t)` |
| `\n` | Newline character. | `(\n)` |
| `\r` | Carriage return. | `(\r)` |
| `\s` | Any whitespace character (Same as  `(' ', \t, \n)`). | `(\s)` |
| `\d` | Any digit (Same as  `(0 - 9)`). | `(\d)` |
| `\w` | Any word character (Same as  `(a - z, A - Z, 0 - 9, \_)`). | `(\w)` |
| `\t` | Tab character. | `(\t)` |
| `\0` | Null character. | `(\0)` |

> ⚠ The amount of `\` you need to use depends on your envieroment! In a JS-Literal its `\\` whereby in a text-file it's only one.

### Groups

Imagine groups as containers, each container can parse and _return_ a value. There are three main types: **objects**, **arrays** and **strings**. Each group can only return one of these three types, this way your definitions stay simple and their result predicable which is, next to [comments](#comments) extremely important to keep it maintainable.

The return value of a group determines whenever the group was successfully parsed.

#### Multipliers

Groups generally (and types used within groups) can have multipliers to define how often the given sequence should occur:

| Sign           | Name          | Description                                         | Examples                                                     |
| -------------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------ |
|                | No multiplier | Match exactly one time.                             | `['A']` `<abc>`                                              |
| `+`            | Plus-sign     | One or more times.                                  | `['A']+` `<abc>+`                                            |
| `*`            | Asterisk      | Zero or more times.                                 | `['A']*` `<abc>*`                                            |
| `{min, [max]}` | Curly braces  | min up to max times (both inclusive).               | `['A']{3,6}` `<abc>{3,}` *(Empty means infinity, e.g. 3-to-infinity)* |
| `?`            | Question mark | One or zero time (basically that makes it optional) | `['A']?` `<abc>?`                                            |

Each multiplier will result in different kind of results.

* `*` Will result in array (if used in a [`array-group`](#array-group)) or string (if used in a [`object-group`](#object-group)) , it really depends on the context. If it only contains strings they'll be joined.
* `+` or `{min, max}` Could **either** return an **array** (or string, see `*` operator above) or **`null`** since it's required to match _at least_ one time.
* `?` Is **either** the result or **`null`**.


#### Combinators

Combinators define how components in a group should be treated:

| Sign | Name             | Description                                                  | Example      |
| ---- | ---------------- | ------------------------------------------------------------ | ------------ |
|      | Juxtaposition    | Each component is mandatory and must appear in the given order | `'A' <abc>`  |
| `|`  | Single bar       | Exactly one of the components must match                     | `'A' | 'B'`  |
| `&`  | Ampersand        | Each component is mandatory but the may appear in any order  | `'A' & 'B'`  |
| `&&` | Double ampersand | At least one component must be present, and the may appear in any order | `'A' && 'B'` |

Combinators don't have any priorities, mixed combinators will be grouped from left to right. Use [groups](#group-definition) to
bypass precedence rules.

#### String group

Let's start with the simplest one, the **string-group**. This group-type returns a string and that's it, each group, if no type was defined, is per default a string group. The following example will parse "Hello World" and return it:

```js
const parse = compile(`
    // The "string:" part is in case of a string optional, it defines our group-type
	entry [string:

		// We expect exact the following char-sequence
		"Hello World"
	]
`);

console.log(parse('Hello World')); // Prints "Hello World"
console.log(parse('Hello world')); // Prints null - the "w" is a not a uppercase letter
```

If we want to exclude a part of our string, let's say "Hello " we could omit it with the `void` operator:

```js
const parse = compile(`
	entry [string:
		
		// Omit the "Hello " string in our final result
		void ["Hello "] 
		"World"
	]
`);

console.log(parse('Hello World')); // Prints just "World"
```

The `void` expects exactly one group.

#### Array group

The **array-group** is used whenever you want to parse a list-like structure like an array, you can use the `push` operator to push values into your array, let's parse a very simple array statement:

```js
const parse = compile(`
	entry [array:
		'[' // Our array starts with a "["

    		[
    			// Our first value
    			push [(\\w)+]
            
    			/* The first value might be followed by even more values but we're
                 * gonna use the * operator to allow single values.
                 */ 
    			[
    				// Each following value need have a comma in front of it
    				','
    				push [(\\w)+]
    			]*
    
    		// The content is optional, if we'd leave the ? out at least one
            // value would nee to be present
    		]? 
		']'
	]
`);

console.log(parse('[]')); // Outputs []
console.log(parse('[hello]')); // Outputs ['hello']
console.log(parse('[hello,world]')); // Outputs ['hello', 'world']
```

Of course there's a lot which could be improved, for example we don't allow whitespace between each value _(Can be easily done via [common tokens](#common-tokens))_. Each `push` statement expects one **group** or **string**.

#### Object group

A **object-group**, finally, let us create complex data-hierarchies and wrap our **strings** and **arrays** into reasonable groups. They're insanely powerful but can also lead to poorly-readable code - make use of [types][type-definition] in this case. Use `def` statements within them to define properties:

````js
const parse = compile(`
	entry [object:
        
        // Define a low property containing lowercase letters
        def low = [(a - z)+]
        
        // We can spare the void-statement since we're not in a string-group
        // We'll also make it optional
        [' ']?
        
        // A up property, which is optional, containing uppercase letters
        def up = [(A - Z)+]?
	]
`);

console.log(parse('hello')); // Outputs {low: 'hello', up: null}
console.log(parse('hello WORLD')); // Outputs {low: 'hello', up: 'WORLD'}
console.log(parse('')); // Outputs null - we're expecting at least one lowercase letter
````

And that's it. 



#### Operators

| Syntax                        | Can be used within...          | Description                                                  | Example       |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------ | ------------- |
| `void <group>`                | `String`,`Array`,`Object` [^1] | Ignores value of `<group>`.                                  | `void ['A']`  |
| `push <group|string>`         | `Array`                        | Appends a value to the array.                                | `push ['A']`  |
| `def <name> = <group|string>` | `Object`                       | Defines a property `<name>` within the object with the given value. | `def = ['A']` |

[^1]:`void` only makes sense in `string` since `array` and `object` doesn't return strings.

> ⚠ Using incompatible operators will lead to an runtime-error!

### Types

A type is a re-usable form of a group which can be used in other declarations, it's even possible to create recursive parser with it!

Each type can either be a [parsing-group](#group-definition), to **group related** types together, or a direct definition of a character / type sequence.
```html
// Group definition
<my-group-type> = ['A']

// Block / Scope definition
<my-block-type> = {...}
```

Types used in declarations can be [multiplied](#multipliers):
```html
entry [<my-type>+]
```

#### Spread operator

If you're within a [`object-group`](#object-group) and want to inherit all values from another [`object-group`](#object-group) you can use the spread operator `...` (the same counts for arrays):

````js
const parse = compile(`
    <uppercase> = [object:
        def up = [(A - Z)+]
    ]
    
    <lowercase> = [object:
        def low = [(a - z)+]
    ]

	entry [object:
        ...<lowercase>
        ...<uppercase>?
	]
`);

console.log(parse('hello')); // Outputs {low: 'hello'}
console.log(parse('helloWORLD')); // Outputs {low: 'hello', up: 'WORLD'}
console.log(parse('')); // Outputs null - <lowercase> isn't optional
````

#### Arguments

It's possible to pass groups to types:

```js
const parse = compile(`
    // You can specify default values by using the assign operator on arguments
    <string sign=['"'] content> = [object:
        <sign> // Arguments are used just like types
        def body = [<content>]
        <sign>
    ]
    
    entry [object:
        
        // Arguments with default-value aren't mandatory
        // and can be overridden any time.
        ...<string content=[(a - z, A - Z, 0 - 9)+]>
    ]
`);

console.log(parse('"hello"')); // Outputs {body: 'hello'}
```



### Block definition

Blocks (or scopes) can be used to scope [types](#type-definition) and group related [types](#type-definition) together without interfering other types.

Each block can have exactly one, optional, `default` export which can be used to define the behavior if you use it without referring to
sub-types, and an arbitrary amount of _exported_ types:

```html
<characters> = {

  // Exported types
  export <uppercase> = [(A - Z)]
  export <lowercase> = [(a - z)]
  export <numbers> = [(0 - 9)]

  // Default export if <character> is used without referring to exported types.
  // The default will match either 'A' to 'Z', 'a' to 'z' or '0' to '9'
  default [<uppercase> | <lowercase> | <numbers>]
}

// Using <characters> without deep-selection will result in [<uppercase> | <lowercase> | <numbers>]
// To access nested e.g. the <uppercase> type use `<characters:uppercase>`
entry [<characters>+]
```

### Conditional Statements
It's possible to use if-statements within a group to execute another group by condition.
In your condition you can to use the dollar-sign `$` to access the current [array-indecies](#array-group) or [object-properties](#object-group) and JavaScript-like property-lookups.

```
if ($foo.bam[3].baz != null) [
    // If foo is not null, bam neither, bam got a third non-null value and is an actual array
    // and the array element has an attribute baz which isn't null.
]
```

> If a property (or array-value) is missing it'll be treated as `null`. 

#### Logical Operators
Use them to fine-tune your conditional statement:

| Sign | Description | Example |
| ---- | ----------- | ------- |
| `<` / `>`  | Greater- / Smaller-than, compatible with both strings and numbers. | `if ($a < $b) [...]` |
| `<=` / `>=`  | Greater- / Smaller-or-equal-than. | `if ($a <= $b) [...]` |
| `=` | Equal, strictly compares numbers, strings and `null` values. | `if ($a = "ABC") [...]` |
| `!=` | Not equal, strictly compares numbers, strings and `null` values. | `if ($a != 25) [...]` |
| `|` | or-operator, one of the conditions need to be true. | `if ($a = "ABC" | $b < 10) [...]` |
| `&` | and-operator, both conditions need to be true. | `if ($a > 20 & $b < $a) [...]` |

Use parenthesis to bypass precedence rules:

```
if ($numA > 100 & $strA < #strB | ($numA = $obj[3].a)) [
    // $numA is bigger than 100
    // $strA is smaller than $strB
    // $numA is the same as the propery "a" from the third element in $obj
] else [
    // Alternate content
]
```

It's possible to directly chain if-statements / using another if-statement as else-branch making an `else-if`-statement.
```
if (...) [
 
] else if (...) [

]
```

> You can chain as many if-statements as you want.

#### Constants
Constants can be used within conditional statements to make comparisons which aren't possible otherwise.

| Name | Description | Example |
| ---- | ----------- | ------- |
| `null` | `null`-value, used to determine whenever a value is null. | `if ($a = null) [...]` |