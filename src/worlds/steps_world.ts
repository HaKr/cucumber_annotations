import * as CucumberJS from 'cucumber'
import { CustomWorld } from './custom_world'

const INITIAL_RESULT: CucumberJS.ScenarioResult = { duration: -1, status: CucumberJS.Status.UNDEFINED }

export class Result {
   constructor( private result: CucumberJS.ScenarioResult = INITIAL_RESULT ) { }

   assign( result?: CucumberJS.ScenarioResult ) { this.result = result || INITIAL_RESULT }
   get isReady() { return this.result.status == CucumberJS.Status.FAILED || this.result.status == CucumberJS.Status.PASSED }
   get isSuccess() { return this.result.status == CucumberJS.Status.PASSED }
   get isFailed() { return this.result.status == CucumberJS.Status.FAILED }
}



export class StepsWorld {
   protected customWorld: CustomWorld
   protected result = new Result()

   get parameters() { return this.customWorld.parameters }

   setCustomWorld( customWorld: CustomWorld ) {
      this.customWorld = customWorld
   }

   getWorldByConstructor( worldConstructor: Function ) {
      return this.customWorld.getWorldByConstructor( worldConstructor )
   }

   attach( data: string, mime_type?: string, callback?: Function ) {
      this.customWorld.attach( data, mime_type, callback )
   }

}
