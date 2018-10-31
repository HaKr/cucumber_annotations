import { setWorldConstructor } from 'cucumber'

import { WorldsMap }  from './annotated_world'

export type AttachFunction = ( data: string, mime_type?: string, callback?: Function ) => void
export type CucumberCLIArguments = { [ key: string ]: any }

export interface WorldOptions {
   attach: AttachFunction,
   parameters: CucumberCLIArguments
}

export class CustomWorld {
   attach: AttachFunction
   parameters: CucumberCLIArguments

   constructor( options: WorldOptions ) {
      this.attach = options.attach
      this.parameters = options.parameters
      WorldsMap.create( this )
   }
   
   getWorldByConstructor( worldConstructor: Function ) {
       return WorldsMap.getWorldByConstructor(worldConstructor)
   }
}

setWorldConstructor( CustomWorld )
