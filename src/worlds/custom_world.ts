import * as CucumberJS from 'cucumber'

import { WorldsMap } from './annotated_world'
import { Metadata as ScenarioMetadata } from '../support/scenario_metadata'

export type AttachFunction = ( data: string, mime_type?: string, callback?: Function ) => void
export type CucumberCLIArguments = { [key: string]: any }

interface MetadataConstructor 
{
	new( customWorld: CustomWorld, scenario: CucumberJS.HookScenarioResult ): ScenarioMetadata
}

let metadataConstructor: MetadataConstructor | null = null

export interface WorldOptions
{
	attach: AttachFunction,
	parameters: CucumberCLIArguments
}

export class CustomWorld
{
	attach: AttachFunction
	parameters: CucumberCLIArguments

	constructor( options: WorldOptions )
	{
		this.attach = options.attach
		this.parameters = options.parameters
		WorldsMap.create( this )
	}

	getWorldByConstructor( worldConstructor: Function )
	{
		return WorldsMap.getWorldByConstructor( worldConstructor )
	}

	dispatchScenario( scenario: CucumberJS.HookScenarioResult )
	{
		WorldsMap.dispatchMetadata( new metadataConstructor!( this, scenario ) )
	}

}


export function addHooks( constructor: MetadataConstructor )
{
	metadataConstructor = constructor

	CucumberJS.Before( CustomWorld.prototype.dispatchScenario )

	CucumberJS.BeforeAll( () => CucumberJS.After( CustomWorld.prototype.dispatchScenario ) )
}

CucumberJS.setWorldConstructor( CustomWorld )
