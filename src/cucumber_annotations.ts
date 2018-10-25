import * as Cucumber from 'cucumber'
import { expect } from 'chai'

export interface Engine {
   scenario: Scenario
   scenarioName: string
   scenarioStatus: string
   getWorldByConstructor( worldConstructor: Function ): any
}

/**
 * For documentation purpose only; indicate the following class as a Cucumber world
 */
export function World( constructor: any ) {
   SolarSystem.addWorld( <WorldConstructor>constructor )
}

/** Register the following method as a Cucumber "before all scenarios" callback 
 *  The method *must* be static
 * */
export function BeforeAll( options: Cucumber.HookOptions = {} ) {
   return createHook( SolarSystem.addBeforeAll, options )
}

/** Register the following method as a Cucumber step */
export function Given( pattern: Pattern, options: StepDefinitionOptions = {} ) { return defineStep( pattern, options ) }

/** Register the following method as a Cucumber step */
export function When( pattern: Pattern, options: StepDefinitionOptions = {} ) { return defineStep( pattern, options ) }

/** Register the following method as a Cucumber step */
export function Then( pattern: Pattern, options: StepDefinitionOptions = {} ) { return defineStep( pattern, options ) }

/** Register the following method as a Cucumber "after each scenario" callback 
 *  (There is no Before, since the class is instantiated before each scenario)
 * */
export function After( options: Cucumber.HookOptions = {} ) {
   return createHook( SolarSystem.addAfter, options )
}

/** Register the following method as a Cucumber "after all scenarios" callback 
 *  The method *must* be static
 * */
export function AfterAll( options: Cucumber.HookOptions = {} ) {
   return createHook( SolarSystem.addAfterAll, options )
}

/** Set the default timeout for asynchronous steps. Defaults to 5000 milliseconds. */
export const setDefaultTimeout = Cucumber.setDefaultTimeout

interface WorldConstructor {
   new( engine: Engine ): object
   name: string
}

interface WorldPrototype {
   constructor: WorldConstructor
}

interface StepDefinitionOptions extends Cucumber.StepDefinitionOptions { }

type Scenario = Cucumber.HookScenarioResult
type WorldMeta = WorldConstructor | WorldPrototype
type FunctionSet = { [ index: string ]: Function }
type StepToWorldSet = { [ index: string ]: ProtoWorld }
type ProtoWorldSet = { [ index: string ]: ProtoWorld }
type Pattern = string | RegExp
type Options = Cucumber.StepDefinitionOptions | Cucumber.HookOptions
type HookDefinition = { method: Function, options: Options }

class ProtoWorld {
   public readonly name: string

   constructor( readonly worldConstructor: WorldConstructor ) {
      this.name = worldConstructor.name
   }

   protected instance: any = null
   protected steps: FunctionSet = {}
   protected beforeAlls: HookDefinition[] = []
   protected afters: HookDefinition[] = []
   protected afterAlls: HookDefinition[] = []

   get world() { return this.instance }

   addBeforeAll( beforeMethod: Function, options: Options ) {
      expect( beforeMethod.length, 'Before all hooks have no arguments.' ).to.be.lessThan( 1 )
      this.beforeAlls.push( { method: beforeMethod, options: options } )
   }

   registerStep( stepMethod: Function, _options: Options, stepName: string ) {
      this.steps[ stepName ] = stepMethod
   }

   addAfter( afterMethod: Function, options: Options ) {
      this.afters.push( { method: afterMethod, options: options } )
   }

   addAfterAll( afterMethod: Function, options: Options ) {
      this.afterAlls.push( { method: afterMethod, options: options } )
   }

   create( engine: Engine ) { this.instance = new this.worldConstructor( engine ) }

   doBeforeAll( engine: SolarSystem ) {
      this.callMethods( this.beforeAlls, engine )
   }

   takeStep( stepName: string, ...args: any[] ) {
      const step = this.steps[ stepName ]
      step.call( this.instance, ...args )
   }

   doAfter( engine: SolarSystem ) {
      this.callMethods( this.afters, engine )
   }

   doAfterAll( engine: SolarSystem ) {
      this.callMethods( this.afterAlls, engine )
   }

   protected callMethods( definitions: HookDefinition[], engine: SolarSystem ) {
      definitions.forEach( ( definition ) => definition.method.call( this.instance, engine ) )
   }
}

class SolarSystem implements Engine {

   constructor() {
      for ( let worldName in SolarSystem.worlds ) {
         const world = SolarSystem.worlds[ worldName ]
         world.create( this )
      }
   }

   scenario: Cucumber.HookScenarioResult

   get scenarioName() { return this.scenario.pickle.name }
   get scenarioStatus() { return this.scenario.result != undefined ? this.scenario.result.status : 'initialising' }

   protected static worlds: ProtoWorldSet = {}
   protected static stepToWorld: StepToWorldSet = {}
   protected static hasBefores = false
   protected static hasAfters = false

   protected static getWorld( worldMeta: WorldMeta ) {

      const constructor = getConstructor( worldMeta )
      let result = SolarSystem.worlds[ constructor.name ]

      if ( result == undefined ) {
         result = new ProtoWorld( constructor )
         SolarSystem.worlds[ constructor.name ] = result
      }

      return result
   }

   getWorldByConstructor( worldConstructor: Function ) {
      const world = SolarSystem.getWorld( <WorldConstructor>worldConstructor )
      return world.world
   }

   private static modifyWorld(
      which: WorldMeta,
      how: Function,
      target: Function,
      mustBeStatic: boolean,
      hookName: string,
      options: Cucumber.HookOptions,
      stepName?: string ) {
      const isStatic = metaIsConstructor( which )
      if ( isStatic != mustBeStatic ) {
         expect.fail( isStatic, mustBeStatic, `${hookName} hook ${mustBeStatic ? 'must' : 'may not'} be a static member.` )

      } else {
         how.call( SolarSystem.getWorld( which ), target, options, stepName )
      }
   }

   static addBeforeAll( worldMeta: WorldMeta, beforeMethod: Function, options: Options ): any {
      SolarSystem.modifyWorld( worldMeta, ProtoWorld.prototype.addBeforeAll, beforeMethod, true, 'Before All', options )
   }

   static registerStep( worldMeta: WorldMeta, stepName: string, stepMethod: Function, stepMethodName: string ) {
      const
         world = SolarSystem.getWorld( worldMeta ),
         designator = `Step ${world.name}::${stepMethodName}`

      SolarSystem.modifyWorld( worldMeta, ProtoWorld.prototype.registerStep, stepMethod, false, designator, {}, stepName )
      SolarSystem.stepToWorld[ stepName ] = SolarSystem.getWorld( worldMeta )
   }

   static addAfter( worldMeta: WorldMeta, afterMethod: Function, options: Options ) {
      SolarSystem.hasAfters = true
      SolarSystem.modifyWorld( worldMeta, ProtoWorld.prototype.addAfter, afterMethod, false, 'After each scenario', options )
   }

   static addAfterAll( worldMeta: WorldMeta, afterMethod: Function, options: Options ) {
      expect( afterMethod.length, `After all hooks have no arguments.` ).to.be.lessThan( 1 )
      SolarSystem.modifyWorld( worldMeta, ProtoWorld.prototype.addAfterAll, afterMethod, true, 'After All', options )
   }

   static addWorld( _worldConstructor: WorldConstructor ) { }


   BeforeAll() {
      SolarSystem.hasAfters && Cucumber.After( SolarSystem.prototype.After )
      SolarSystem.prototype.callWorldsHooks.call( null, ProtoWorld.prototype.doBeforeAll )
   }

   AfterAll() {
      SolarSystem.prototype.callWorldsHooks.call( null, ProtoWorld.prototype.doAfterAll )
   }

   protected callWorldsHooks( hookMethod: Function ) {
      for ( let worldName in SolarSystem.worlds ) {
         const world = SolarSystem.worlds[ worldName ]
         hookMethod.call( world, this )
      }
   }

   Before( scenario: Cucumber.HookScenarioResult ) {
      this.scenario = scenario
   }

   After( scenario: Cucumber.HookScenarioResult ) {
      this.scenario = scenario
      this.callWorldsHooks( ProtoWorld.prototype.doAfter )
   }

   takeStep( stepName: string, ...args: any[] ) {
      const world = SolarSystem.stepToWorld[ stepName ]
      world.takeStep( stepName, ...args )

      return true
   }
}

function metaIsConstructor( worldMeta: WorldMeta ): worldMeta is WorldConstructor {
   return typeof ( <WorldConstructor>worldMeta ).name == 'string'
}

function getConstructor( worldMeta: WorldMeta ) {
   if ( typeof worldMeta == 'object' ) {
      return worldMeta.constructor
   } else {
      return worldMeta
   }
}

function createHook( hookFunction: Function, options: Cucumber.HookOptions ) {
   return ( worldMeta: any, _stepMethodName: string, descriptor: PropertyDescriptor ) => {
      hookFunction.call( null, <WorldMeta>worldMeta, descriptor.value, options )
   }
}

function createStepFunction( stepName: string, stepMethodName: string, arity: number ){
      const result = ( self: SolarSystem, ...args: any[] ) => self.takeStep( stepName, ...args )
      Object.defineProperties( result, {
            'length': { value: arity },
            'name': { value: stepMethodName }
      })
      return result
}

/**
 * Register a custom world's method to act as a Cucumber step 
 * @param stepName
 * 
 * TODO: Find a better way to implement this. The cucumber engine does an arity check on the
 * callback functions. Using the spread operator in the callback function will be translated into
 * javascript by looking at the arguments special variable, leaving the arity to 0
 */
function defineStep( pattern: Pattern, options: Cucumber.StepDefinitionOptions = {} ) {
   return ( target: any, stepMethodName: string, descriptor: PropertyDescriptor ) => {
      const
         stepMethod = <Function>descriptor.value,
         worldMeta = <WorldMeta>target,
         stepName = typeof pattern == 'string' ? pattern : pattern.source
      
      Cucumber.defineStep( pattern, options, createStepFunction( stepName, stepMethodName, stepMethod.length )  )

      SolarSystem.registerStep( worldMeta, stepName, stepMethod, stepMethodName )
   }
}


Cucumber.BeforeAll( SolarSystem.prototype.BeforeAll )
Cucumber.Before( SolarSystem.prototype.Before )
Cucumber.AfterAll( SolarSystem.prototype.AfterAll )

Cucumber.setWorldConstructor( SolarSystem )
