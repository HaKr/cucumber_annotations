import * as CucumberJS from 'cucumber'
import '../worlds/custom_world'

import * as Options from './options'
import { WorldsMap } from '../worlds/annotated_world'

export type Transformer = ( this: any, ...arg: string[] ) => any
export type Pattern = string | RegExp

/** Use the following method as a custom type transformer */
export function Type( name: string, regexp: RegExp, options: Options.Type = {} ) {
   return ( _target: any, _stepMethodName: string, descriptor: PropertyDescriptor ) => {
      CucumberJS.defineParameterType( {
         name: name, regexp: regexp,
         transformer: <Transformer>descriptor.value,
         preferForRegexpMatch: options.preferForRegexpMatch || false,
         useForSnippets: options.useForSnippets || true
      } )
   }
}

/** Given, When and Then are all just steps... execute below method when a scenario step matches the pattern */
function defineStep( pattern: Pattern, options: Options.ScenarioStep = {} ) {
    return ( worldMeta: any, stepMethodName: string, descriptor: PropertyDescriptor ) => {
       CucumberJS.defineStep( pattern, options, WorldsMap.getWorldByMeta( worldMeta ).createDelegatedCucumberJSMethod( stepMethodName, descriptor.value ) )
    }
 }

/** Given the pattern, execute the following method */
export const Given = defineStep
/** When the pattern matches a scenario step, execute the following method */
export const When = defineStep
/** If the pattern matches a scenario step, then execute the following method */
export const Then = defineStep

/** Given, When and Then are all just steps... execute below method when a scenario step matches the pattern */
export const Pattern = defineStep
