import * as Cucumber from 'cucumber_annotations'
import { expect } from 'chai'

import { AnnotationWorld } from './annotation_steps'

interface StringSet { [ index: string ]: string }
const SunStates: StringSet = {
   'is dark': 'darkness',
   shines: 'light',
   fades: 'twilight',
   storms: 'chaos'
}

Cucumber.setDefaultTimeout( 500 )

export class SeparateWorld {
   private ambient = "is dark"
   private crossWorld: AnnotationWorld
   static thingy = ""

   constructor( engine: Cucumber.Engine ) {
      this.crossWorld = <AnnotationWorld>engine.getWorldByConstructor( AnnotationWorld )
   }

   @Cucumber.BeforeAll()
   static beforeAllScenarios() {
      SeparateWorld.thingy = "hello"
   }

   @Cucumber.AfterAll()
   static signOff() { SeparateWorld.thingy = "bye" }


   @Cucumber.After()
   afterScenario( engine: Cucumber.Engine ) {
      SeparateWorld.thingy = `${engine.scenarioName}: ${engine.scenarioStatus}`
   }

   @Cucumber.Given( /there is a separate (\w+)/, { timeout: 1 } )
   separateSomething( world: string ) {
      SeparateWorld.thingy = world
   }

   @Cucumber.When( 'the sun {word}' )
   turnSun( ambient: string ) {
      this.ambient = ambient
   }

   @Cucumber.Then( 'there will be {word}' )
   letThereBe( state: string ) {
      expect( state, 'The sun\'s state is unexpected' ).to.equal( SunStates[ this.ambient ] )
   }

   @Cucumber.Then( 'the execution of the annotated method comes still as {word}' )
   executionOrder( order: string ) {
      expect( order, 'Sequence order unexpected?' ).to.equal( this.crossWorld.executionOrder )
   }

}

