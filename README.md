# Typecript Annotions for Cucumber

## Cucumber
[Cucumber](https://cucumber.io) is a tool for running automated tests written in plain language. Because these
test are written in plain language, they can be read by anyone on your team. Because they can be
read by anyone, you can use them to help improve communication, collaboration and trust on
your team.

## Typescript
[Typescript](https://typescriptlang.org) is a typed superset of javascript that transpiles to plain javascript bbefore it is run.
At first, the benefit is only for the developer, who gets better support in writing stable code because of the added static typing.

## Combining two good tools
Cucumber comes with a javascript runtime, that already has added typescript support. This way, developers can write their step implementations in Typescript source code. With that, the circle looks complete and Typescript modules can be tested using Gherkin feature descriptions with typescript steps. Well, almost when we get beyond the 'Hello world' example.

### Example
Let's take the original [Cucumber](https://github.com/cucumber/cucumber-js/blob/master/docs/nodejs_example.md) example.
(with a small tweak to document two other features.) 


#### Setup

* Install [Node.js](https://nodejs.org) (6 or higher)
* Install the following node modules with [yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com/)
  * typescript@>=2.0
  * ts-node@latest
  * cucumber_annotations@latest
  

* Add the following files

```gherkin
    # features/simple_math.feature
    Feature: Simple maths
      In order to do maths
      As a developer
      I want to increment variables

	  Scenario: easy maths
	    Given a variable set to 1
	    When I increment the variable by 1
	    Then the variable in words would read two
	    
      Scenario Outline: much more complex stuff
        Given a variable set to <var>
        When I increment the variable by <increment>
        Then the variable should contain <result>

        Examples:
          | var | increment | result |
          | 100 |         5 |    105 |
          |  99 |      1234 |   1333 |
          |  12 |         5 |     18 |
```

```typescript
    // features/steps/simple_math_world.ts
	import { Given, When, Then, Type } from "cucumber_annotations"
	import { expect } from 'chai'
	
	const NUMBERS_IN_WORDS = ['one', 'two', 'three']
	const NUMBERS_IN_WORDS_PATTERN = RegExp( NUMBERS_IN_WORDS.join( '|' ) )

	export class SimpleMathWorld {
	  private result = 0
	  
	  @Given( 'a variable set to {int}' )
	  setTo( n: number ){ this.result = n  }
	  
	  @When('I increment the variable by {int}')
	  incrementBy(n: number) { this.result += n  }
	  
	  // custom types can be annotated too
	  @Type( 'number_in_words', NUMBERS_IN_WORDS_PATTERN )
	  wordToNumber( text: string ) { return NUMBERS_IN_WORDS.indexOf( text ) + 1 }
	  
	  // multiple annotations are allowed
	  @Then('the variable should contain {int}')
	  @Then('the variable in words would read {number_in_words}')
	  shouldBe( n: number ) { expect(this.result).to.eql(n) }
	}
```

	/*
	 * The export for the SimpleMathWorld class is required, as the Typescript 
	 * compiler otherwise would complain that it is: "declared but never used."
	 */

```json
	# tsconfig.json
	{
		"compilerOptions": {
			"experimentalDecorators": true
		}
	}
```
	
* Run: 

```s
> cucumber-js --require-module ts-node/register --require "features/scripts/**/*.ts"

...........F

Failures:

1) Scenario: much more complex stuff # features\simple_maths.feature:20
   √ Given a variable set to 12 # src\annotations\steps.ts:25
   √ When I increment the variable by 5 # src\annotations\steps.ts:25
   × Then the variable should contain 18 # src\annotations\steps.ts:25
       AssertionError
           + expected - actual

           -17
           +18

           at SimpleMathWorld.shouldBe (cucumber_annotations\features\scripts\simple_maths_steps.ts:24:51)
           at CustomWorld.delegate_to_SimpleMathWorld_shouldBe (cucumber_annotations\src\worlds\annotated_world.ts:83:15)

4 scenarios (1 failed, 3 passed)
12 steps (1 failed, 11 passed)
0m00.003s

```

* Note that the error was introduced deliberately in the feature file. Here one can see that all Give/When/Then annotations are registered 
	in the source of this library. Of course, any AssertionError shows the offending line in the annotated class.