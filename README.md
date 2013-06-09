
# CLI Calculator in JavaScript for Node.js 


### First, install [node.js](http://nodejs.org/) by doing something like:
* Browsing to [http://nodejs.org/download/](http://nodejs.org/download/), or
* `brew install node`

### Then, run the calculator CLI by executing:
`./calculator`

### You should see a prompt that looks like:

```
$ ./calculator 
? 
```

### Start typing expressions!

Basic maths are supported:

```
? 3 * 3
=> 9
```


```
? 3 + 4 * 3
=> 15
```


```
? (3 + 4) * 3
=> 21
```

It's JavaScript math though (for now), so you can't always trust the results...

```
? .1 + .2
=>  0.30000000000000004
```

The CLI supports exponentiation with `**`:

```
? 3 * 4**5
=>  3072
```

It supports variable assignments, one per line. Variable names must be lowercase, and consist only of letters.

```
? x = 3
=> 3
? x + 3
=> 6
```


```
? x = 3
=> 3
? y = 4
=> 4
? x + y
=> 7
```


```
? asdf = 3 + 4 ** 7 * 4 + (3 + 4)
=> 65546
```

You can also call functions. Calls are passed through to functions defined on JavaScript's Math object:

```
? sin(2)
=>  0.9092974268256817  // (radians)
```


```
? pow(3 * 4, 1 + 1)
=> 144
```

Nested function calls are supported as well:

```
? pow( sin(2), 3 ** (0 + 1) )
=>  0.7518269446689928
```


### Known Issues

* The error messages thrown by the parser are probably next to worthless most of the time, but if you don't mistype anything, it'll work great!
* The actual evaluation is currently delegating to the JS engine for evaluation, so it's basically double precision floating point math, which is mostly fine. Someday I plan to integrate (probably very slow) arbitrary-precision arithmetic. I have the beginnings of a [BigInt](https://github.com/roblg/project-euler/blob/master/js/BigInt.js) class in my [projecteuler](http://projecteuler.net) solutions, but it doesn't handle subtraction/division/negative numbers yet. Switching to aribtrary precision numbers would also eliminate the usefulness of the JS Math function passthrough. 
* I think it would be fun to extend to allow the user to define arbitrary functions.
