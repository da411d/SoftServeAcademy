Indexed collections
+ Array
+ Iterators
+ Typed Array

Keyed collections 
+ Map 
+ Set 
+ WeakMap 
+ WeakSet

# Arrays

## Create an Array
```
let fruits = ['Apple', 'Banana'];
console.log(fruits.length);
// 2
```

## Access (index into) an Array item
```
let first = fruits[0];
// Apple
let last = fruits[fruits.length - 1];
// Banana
```

## Loop over an Array
```
fruits.forEach(function(item, index, array) {
  console.log(item, index);
});
// Apple 0
// Banana 1
```

## Add to the end of an Array
```
let newLength = fruits.push('Orange');
// ["Apple", "Banana", "Orange"]
```

## Remove from the end of an Array
```
let last = fruits.pop(); // remove Orange (from the end)
// ["Apple", "Banana"];
```

## Remove from the front of an Array
```
let first = fruits.shift(); // remove Apple from the front
// ["Banana"];
```

## Add to the front of an Array
```
let newLength = fruits.unshift('Strawberry') // add to the front
// ["Strawberry", "Banana"];
```

## Find the index of an item in the Array
```
fruits.push('Mango');
// ["Strawberry", "Banana", "Mango"]

let pos = fruits.indexOf('Banana');
// 1
```

## Remove an item by index position
```
let removedItem = fruits.splice(pos, 1); // this is how to remove an item
										
// ["Strawberry", "Mango"]
```

## Remove items from an index position
```
let vegetables = ['Cabbage', 'Turnip', 'Radish', 'Carrot'];
console.log(vegetables); 
// ["Cabbage", "Turnip", "Radish", "Carrot"]

let pos = 1, n = 2;

let removedItems = vegetables.splice(pos, n); 
// this is how to remove items, n defines the number of items to be removed,
// from that position(pos) onward to the end of array.

console.log(vegetables); 
// ["Cabbage", "Carrot"] (the original array is changed)

console.log(removedItems); 
// ["Turnip", "Radish"]
```

## Copy an Array
```
let shallowCopy = fruits.slice(); // this is how to make a copy
// ["Strawberry", "Mango"]
```

# Iterators

## Examples of iterable objects
```
let arr = [1, 2, 3]; // array - example of iterable object

for (let value of arr) {
	console.log(value); // 1, then 2, then 3
}
```

String is iterable too.

```
for (let char of "Hello") {
	console.log(char); // Letter by letter: H, e, l, l, o
}
```

Almost everywhere, where brute force is needed, it is done through iterators. This includes not only strings, arrays, but also a function call with the spread f operator (...args), and much more.

Unlike arrays, the "iterated" objects may not have a `length`. As we will see later, iterators make it possible to make any objects iterated.

## How to create own iterator without registration and SMS
```
class RangeIterator {
    constructor(from, to) {
        this._from = from;
        this._to = to;
    }

    [Symbol.iterator] = () => {
		let current = this._from;
        let to = this._to;

        return {
            next: () => {
                if(current <= to) {
                    return ( {
                        done: false,
                        value: current++
                    });
                }else {
                    return ( {
                        done: true,
                    });
                }
            }
        }
    }
}

let range = new RangeIterator(1, 10);
for (let num of range) {
    console.log(num);
}
```

If the iteration functionality (the `next` method) is provided by the object itself, then you can return `this` as an iterator:

```
class RangeIterator {
    constructor(from, to) {
        this._current = from;
        this._to = to;
    }

    [Symbol.iterator] = () => {
		return this;
    }

	next = () => {
		if(this._current <= this._to) {
			return ( {
				done: false,
				value: this._current++,
			});
		}else {
			return ( {
				done: true,
			});
		}
	};
}

let range = new RangeIterator(1, 10);
for (let num of range) {
    console.log(num);
}
```

In this case, everything works, but for greater flexibility and clarity of the code, it is recommended to allocate an iterator into a separate object with its own state and code.


## Infinite random generator
```
function rand(mi, ma) {return Math.floor(Math.random() * (ma - mi + 1) + mi);};
function sleep(t) {
	return new Promise((ok)=> {setTimeout(ok, t)});
}
​
class RandomIterator {
	constructor(from, to) {
		this._from = from;
		this._to = to;
	}
​
	[Symbol.iterator] = () => {
		let from = this._from;
		let to = this._to;
​
		return {
			next: () => ( {
				done: false,
				value: rand(from, to),
			}),
		}
	}
}
​
(async () => {
	let randomizer = new RandomIterator(1, 100);
	for (let num of randomizer) {
		console.log(num);
		await sleep(500);
	}
})()
```

## Memory leak

```
class MemoryLeakIterator {
	[Symbol.iterator] = () => ({
		next: () => ( {
			done: false,
			value: 0,
		}),
	});
}
​
let iterator = new MemoryLeakIterator();
let array = [...iterator];
// or
let array = Array.from(iterator);
```

## Built-in iterators

```
let str = 'Hello';

// Equals for (let letter of str)

let iterator = str[Symbol.iterator]();

while(true) {
	let result = iterator.next();
	if (result.done) break;
	console.log(result.value);
}
```

# TypedArray

A TypedArray object describes an array-like view of an underlying binary data buffer. **There is no global property named TypedArray, nor is there a directly visible TypedArray constructor.**  Instead, there are a number of different global properties, whose values are typed array constructors for specific element types, listed below.

## Syntax

```
new TypedArray(); // new in ES2017
new TypedArray(length);
new TypedArray(typedArray);
new TypedArray(object);
new TypedArray(buffer [, byteOffset [, length]]);

where TypedArray() is one of:

Int8Array();
Uint8Array();
Uint8ClampedArray();
Int16Array();
Uint16Array();
Int32Array();
Uint32Array();
Float32Array();
Float64Array();
BigInt64Array();
BigUint64Array();
```

# Map

Map is a collection of keyed data items, just like an `Object`. But the main difference is that `Map` allows keys of any type.

The main methods are:

- `new Map()` -- creates the map.
- `map.set(key, value)` -- stores the value by the key.
- `map.get(key)` -- returns the value by the key, `undefined` if `key` doesn't exist in map.
- `map.has(key)` -- returns `true` if the `key` exists, `false` otherwise.
- `map.delete(key)` -- removes the value by the key.
- `map.clear()` -- clears the map
- `map.size` -- returns the current element count.

For instance:

```
let map = new Map();

map.set('1', 'str1');   // a string key
map.set(1, 'num1');     // a numeric key
map.set(true, 'bool1'); // a boolean key

// remember the regular Object? it would convert keys to string
// Map keeps the type, so these two are different:
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

As we can see, unlike objects, keys are not converted to strings. Any type of key is possible.

**Map can also use objects as keys.**

```
let john = { name: "John" };

// for every user, let's store their visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

Using objects as keys is one of most notable and important `Map` features. For string keys, `Object` can be fine, but it would be difficult to replace the `Map` with a regular `Object` in the example above.

```
let john = { name: "John" };

let visitsCountObj = {}; // try to use an object

visitsCountObj[john] = 123; // try to use john object as the key

*!*
// That's what got written!
alert( visitsCountObj["[object Object]"] ); // 123
*/!*
```

As `john` is an object, it got converted to the key string `"[object Object]"`. All objects without a special conversion handling are converted to such string, so they'll all mess up.

In the old times, before `Map` existed, people used to add unique identifiers to objects for that:

```
// we add the id field
let john = { name: "John", id: 1 };

let visitsCounts = {};

// now store the value by id
visitsCounts[john.id] = 123;

alert( visitsCounts[john.id] ); // 123
```

...But `Map` is much more elegant.


#### How `Map` compares keys
To test values for equivalence, `Map` uses the algorithm [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). It is roughly the same as strict equality `===`, but the difference is that `NaN` is considered equal to `NaN`. So `NaN` can be used as the key as well.

This algorithm can't be changed or customized.


#### Chaining
Every `map.set` call returns the map itself, so we can "chain" the calls:

```
map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```

## Map from Object

When a `Map` is created, we can pass an array (or another iterable) with key-value pairs, like this:

```
// array of [key, value] pairs
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);
```

There is a built-in method [Object.entries(obj)](mdn:js/Object/entries) that returns an array of key/value pairs for an object exactly in that format.

So we can initialize a map from an object like this:

```
let map = new Map(Object.entries({
  name: "John",
  age: 30
}));
```

Here, `Object.entries` returns the array of key/value pairs: `[ ["name","John"], ["age", 30] ]`. That's what `Map` needs.

## Iteration over Map

For looping over a `map`, there are 3 methods:

- `map.keys()` -- returns an iterable for keys,
- `map.values()` -- returns an iterable for values,
- `map.entries()` -- returns an iterable for entries `[key, value]`, it's used by default in `for..of`.

```
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// iterate over keys (vegetables)
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// iterate over values (amounts)
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// iterate over [key, value] entries
for (let entry of recipeMap) { // the same as of recipeMap.entries()
  alert(entry); // cucumber,500 (and so on)
}
```

#### The insertion order is used
The iteration goes in the same order as the values were inserted. `Map` preserves this order, unlike a regular `Object`.

Besides that, `Map` has a built-in `forEach` method, similar to `Array`:

```
// runs the function for each (key, value) pair
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```


# Set

A `Set` is a collection of values, where each value may occur only once.

Its main methods are:

- `new Set(iterable)` -- creates the set, and if an `iterable` object is provided (usually an array), copies values from it into the set.
- `set.add(value)` -- adds a value, returns the set itself.
- `set.delete(value)` -- removes the value, returns `true` if `value` existed at the moment of the call, otherwise `false`.
- `set.has(value)` -- returns `true` if the value exists in the set, otherwise `false`.
- `set.clear()` -- removes everything from the set.
- `set.size` -- is the elements count.

For example, we have visitors coming, and we'd like to remember everyone. But repeated visits should not lead to duplicates. A visitor must be "counted" only once.

`Set` is just the right thing for that:

```
let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// visits, some users come multiple times
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// set keeps only unique values
alert( set.size ); // 3

for (let user of set) {
  alert(user.name); // John (then Pete and Mary)
}
```

The alternative to `Set` could be an array of users, and the code to check for duplicates on every insertion using arr.find. But the performance would be much worse, because this method walks through the whole array checking every element. `Set` is much better optimized internally for uniqueness checks.

## Iteration over Set

We can loop over a set either with `for..of` or using `forEach`:

```
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// the same with forEach:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

Note the funny thing. The callback function passed in `forEach` has 3 arguments: a value, then *again a value*, and then the target object. Indeed, the same value appears in the arguments twice.

That's for compatibility with `Map` where the callback passed `forEach` has three arguments. Looks a bit strange, for sure. But may help to replace `Map` with `Set` in certain cases with ease, and vice versa.

The same methods `Map` has for iterators are also supported:

- `set.keys()` -- returns an iterable object for values,
- `set.values()` -- same as `set.keys`, for compatibility with `Map`,
- `set.entries()` -- returns an iterable object for entries `[value, value]`, exists for compatibility with `Map`.

# WeakMap and WeakSet

`WeakSet` is a special kind of `Set` that does not prevent JavaScript from removing its items from memory. `WeakMap` is the same thing for `Map`.

As we know, JavaScript engine stores a value in memory while it is reachable (and can potentially be used).

For instance:
```
let john = { name: "John" };

// the object can be accessed, john is the reference to it

// overwrite the reference
john = null;

// the object will be removed from memory
```

Usually, properties of an object or elements of an array or another data structure are considered reachable and kept in memory while that data structure is in memory.

For instance, if we put an object into an array, then while the array is alive, the object will be alive as well, even if there are no other references to it.

Like this:

```
let john = { name: "John" };

let array = [ john ];

john = null; // overwrite the reference

// john is stored inside the array, so it won't be garbage-collected
// we can get it as array[0]
```

Or, if we use an object as the key in a regular `Map`, then while the `Map` exists, that object exists as well. It occupies memory and may not be garbage collected.

```
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // overwrite the reference

// john is stored inside the map,
// we can get it by using map.keys()
```

`WeakMap/WeakSet` are fundamentally different in this aspect. They do not prevent garbage-collection of key objects.

Let's explain it starting with `WeakMap`.

The first difference from `Map` is that `WeakMap` keys **must** be objects, not primitive values:

```
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // works fine (object key)

// can't use a string as the key
weakMap.set("test", "Whoops"); // Error, because "test" is not an object
```

Now, if we use an object as the key in it, and there are no other references to that object -- it will be removed from memory (and from the map) automatically.

```
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // overwrite the reference

// john is removed from memory!
```

Compare it with the regular `Map` example above. Now if `john` only exists as the key of `WeakMap` -- it is to be automatically deleted.

`WeakMap` does not support iteration and methods `keys()`, `values()`, `entries()`, so there's no way to get all keys or values from it.

`WeakMap` has only the following methods:

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

Why such a limitation? That's for technical reasons. If an object has lost all other references (like `john` in the code above), then it is to be garbage-collected automatically. But technically it's not exactly specified **when the cleanup happens**.

The JavaScript engine decides that. It may choose to perform the memory cleanup immediately or to wait and do the cleaning later when more deletions happen. So, technically the current element count of a `WeakMap` is not known. The engine may have cleaned it up or not, or did it partially. For that reason, methods that access `WeakMap` as a whole are not supported.

Now where do we need such thing?

The idea of `WeakMap` is that we can store something for an object that should exist only while the object exists. But we do not force the object to live by the mere fact that we store something for it.

```
weakMap.set(john, "secret documents");
// if john dies, secret documents will be destroyed automatically
```

That's useful for situations when we have a main storage for the objects somewhere and need to keep additional information, that is only relevant while the object lives.

Let's look at an example.

For instance, we have code that keeps a visit count for each user. The information is stored in a map: a user is the key and the visit count is the value. When a user leaves, we don't want to store their visit count anymore.

One way would be to keep track of users, and when they leave -- clean up the map manually:

```
let john = { name: "John" };

// map: user => visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123);

// now john leaves us, we don't need him anymore
john = null;

// but it's still in the map, we need to clean it!
alert( visitsCountMap.size ); // 1
// and john is also in the memory, because Map uses it as the key
```

Another way would be to use `WeakMap`:

```js
let john = { name: "John" };

let visitsCountMap = new WeakMap();

visitsCountMap.set(john, 123);

// now john leaves us, we don't need him anymore
john = null;

// there are no references except WeakMap,
// so the object is removed both from the memory and from visitsCountMap automatically
```

With a regular `Map`, cleaning up after a user has left becomes a tedious task: we not only need to remove the user from its main storage (be it a variable or an array), but also need to clean up the additional stores like `visitsCountMap`. And it can become cumbersome in more complex cases when users are managed in one place of the code and the additional structure is in another place and is getting no information about removals.

`WeakMap` can make things simpler, because it is cleaned up automatically. The information in it like visits count in the example above lives only while the key object exists.

`WeakSet` behaves similarly:

- It is analogous to `Set`, but we may only add objects to `WeakSet` (not primitives).
- An object exists in the set while it is reachable from somewhere else.
- Like `Set`, it supports `add`, `has` and `delete`, but not `size`, `keys()` and no iterations.

For instance, we can use it to keep track of whether a message is read:

```js
let messages = [
    {text: "Hello", from: "John"},
    {text: "How goes?", from: "John"},
    {text: "See you soon", from: "Alice"}
];

// fill it with array elements (3 items)
let unreadSet = new WeakSet(messages);

// use unreadSet to see whether a message is unread
alert(unreadSet.has(messages[1])); // true

// remove it from the set after reading
unreadSet.delete(messages[1]); // true

// and when we shift our messages history, the set is cleaned up automatically
messages.shift();

// no need to clean unreadSet, it now has 2 items
// (though technically we don't know for sure when the JS engine clears it)
```

The most notable limitation of `WeakMap` and `WeakSet` is the absence of iterations, and inability to get all current content. That may appear inconvenient, but does not prevent `WeakMap/WeakSet` from doing their main job -- be an "additional" storage of data for objects which are stored/managed at another place.
