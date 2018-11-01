import * as CucumberJS from 'cucumber'
import { expect } from 'chai'

import '../worlds/custom_world'
import * as Options from './options'
import * as AnnotationMetadata from '../support/annotation_metadata'
import { WorldsMap } from '../worlds/annotated_world'

/** Register the following method as a Cucumber "before all scenarios" callback 
 *  The method *must* be static */
export function BeforeAll( options: Options.AllScenarios = {} )
{
	console.log( 'Before all with', options )
	return ( worldMeta: any, stepMethodName: string, descriptor: PropertyDescriptor ) =>
	{
		checkAllScenariosMethod( worldMeta, 'Before', stepMethodName, descriptor.value )
		CucumberJS.BeforeAll.call( null, options, descriptor.value )
	}
}

/** Register the following method as a Cucumber "before each scenario" callback 
 *  the method may *not* be static */
export function Before( options: Options.EachScenario = {} )
{
	return ( worldMeta: any, stepMethodName: string, descriptor: PropertyDescriptor ) =>
	{
		checkEachScenariosMethod( worldMeta, 'Before', stepMethodName, descriptor.value )
		CucumberJS.Before( options, WorldsMap.getWorldByMeta( worldMeta ).createDelegatedCucumberJSMethod( stepMethodName, descriptor.value ) )
	}
}

/** Register the following method as a Cucumber "after each scenario" callback 
 *  the method may *not* be static */
export function After( options: Options.EachScenario = {} )
{
	return ( worldMeta: any, stepMethodName: string, descriptor: PropertyDescriptor ) =>
	{
		checkEachScenariosMethod( worldMeta, 'After', stepMethodName, descriptor.value )
		console.log( 'Add stepsworld After' );
		CucumberJS.After( options, WorldsMap.getWorldByMeta( worldMeta ).createDelegatedCucumberJSMethod( stepMethodName, descriptor.value ) )
	}
}

/** Register the following method as a Cucumber "after all scenarios" callback 
 *  The method *must* be static */
export function AfterAll( options: Options.AllScenarios = {} )
{
	return ( worldMeta: any, stepMethodName: string, descriptor: PropertyDescriptor ) =>
	{
		checkAllScenariosMethod( worldMeta, 'After', stepMethodName, descriptor.value )
		CucumberJS.AfterAll.call( null, options, descriptor.value )
	}
}

function checkAllScenariosMethod(
	worldMeta: AnnotationMetadata.WorldMeta,
	hookDesignator: string,
	methodName: string,
	method: Function
)
{
	const info = `${hookDesignator} all scenarios hook ${AnnotationMetadata.metaGetName( worldMeta, methodName )}`

	AnnotationMetadata.assertMethodConvention( worldMeta, info, true )
	expect( method.length, `${info} may not have parameters.` ).to.be.lessThan( 1 )
}

function checkEachScenariosMethod(
	worldMeta: AnnotationMetadata.WorldMeta,
	hookDesignator: string,
	methodName: string,
	method: Function
)
{
	const info = `${hookDesignator} each scenarios hook ${AnnotationMetadata.metaGetName( worldMeta, methodName )}`

	AnnotationMetadata.assertMethodConvention( worldMeta, info, false )
	expect( method.length, `${info} may accept at most one parameter.` ).to.be.lessThan( 2 )
}
