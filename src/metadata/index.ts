export * from '../steps'
export * from '../scenarios'

import * as CucumberJS from 'cucumber'
import { CustomWorld, addHooks } from '../worlds/custom_world'

import { Metadata as ScenarioMetadata } from '../support/scenario_metadata'
import { StepsWorld } from '../worlds/steps_world'

const INITIAL_RESULT: CucumberJS.ScenarioResult = { duration: -1, status: CucumberJS.Status.UNDEFINED }

export class Metadata implements ScenarioMetadata
{
	private result: CucumberJS.ScenarioResult = INITIAL_RESULT
	protected world: StepsWorld

	constructor( private readonly customWorld: CustomWorld, private readonly scenario: CucumberJS.HookScenarioResult )
	{
		this.result = scenario.result || INITIAL_RESULT
	}

	get parameters() { return this.customWorld.parameters }

	get scenarioName() { return this.scenario.pickle.name }

	getWorldByConstructor( worldConstructor: Function )
	{
		return this.customWorld.getWorldByConstructor( worldConstructor )
	}

	attach( data: string, mime_type?: string, callback?: Function )
	{
		this.customWorld.attach( data, mime_type, callback )
	}

	get isReady() { return this.result.status == CucumberJS.Status.FAILED || this.result.status == CucumberJS.Status.PASSED }
	get isSuccess() { return this.result.status == CucumberJS.Status.PASSED }
	get isFailed() { return this.result.status == CucumberJS.Status.FAILED }
}

addHooks( Metadata )
