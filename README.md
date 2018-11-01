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
  * chai@latest
  * cucumber@latest
  * cucumber_annotations@latest
  * @types/chai@latest
  * @types/cucumber@latest
  * ts-node@latest
  * typescript@latest
  

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
          |  12 |         5 |     17 |
```

```typescript
    // features/steps/simple_math_world.js
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
  
	
* Run `./node_modules/.bin/cucumber-js --require-module ts-node/register --require \"features/steps/**/*.ts\"`

