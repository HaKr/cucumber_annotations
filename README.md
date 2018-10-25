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

```ts
import * as Cucumber from '../support/cucumber_annotations'

export class AnnotationWorld {
   public annotation = "Not annotated yet"

   @Cucumber.Given( 'annotations are possible' )
   possible() {
      return true
   }

   @Cucumber.When( 'John Developer annotates a method with {word}' )
   doAnnotate( word: string ) {
      this.annotation = word
   }

}
```
This example shows an slightly more advanced step implementation for the following (still trivial) scenario.

```gherkin
Scenario: Go beyond 'Hello world'
	Given annotations are possible
	When John Developer annotates a method with Given 
```

```js
var annotation;

Cucumber.When( 'John Developer annotates a method with {word}',
    function( word ) {
        annotation = word;
    }
}
```