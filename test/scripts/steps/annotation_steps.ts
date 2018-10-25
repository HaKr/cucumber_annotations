import * as Cucumber from 'cucumber_annotations'
import { expect } from 'chai'

interface StringMap { [ index: string ]: string }
const AnnotationOrdinals: StringMap = {
   Given: 'first',
   When: 'second',
   Then: 'third'
}

@Cucumber.World
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

   @Cucumber.Then( 'that method is called {word} for each scenario' )
   callAtOrdinal( ordinal: string ) {
      expect( ordinal ).to.be.equal( this.executionOrder )
   }

   get executionOrder() {
      return AnnotationOrdinals[ this.annotation ]
   }
}

