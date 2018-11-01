import { AnnotatedWorld } from '../worlds/annotated_world'
import { CucumberCLIArguments } from '../worlds/custom_world'

export interface Metadata
{
	parameters: CucumberCLIArguments

	scenarioName: string

	getWorldByConstructor( worldConstructor: Function ): AnnotatedWorld

	attach( data: string, mime_type?: string, callback?: Function ): void

	isReady: boolean
	isSuccess: boolean
	isFailed: boolean
}
