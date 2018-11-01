import { expect } from 'chai'
import { StepsWorld } from '../worlds/steps_world'


export interface WorldConstructor
{
	new(): StepsWorld
	name: string
}

export interface WorldPrototype
{
	constructor: WorldConstructor
}

export type WorldMeta = WorldConstructor | WorldPrototype


export function metaIsConstructor( worldMeta: WorldMeta ): worldMeta is WorldConstructor
{
	return typeof ( <WorldConstructor>worldMeta ).name == 'string'
}

export function metaGetName( worldMeta: WorldMeta, methodName: string ): string
{
	let result: string
	if ( metaIsConstructor( worldMeta ) ) {
		result = worldMeta.name
	} else {
		result = worldMeta.constructor.name
	}

	return `${result}::${methodName}`
}

export function getConstructor( worldMeta: WorldMeta )
{
	if ( typeof worldMeta == 'object' ) {
		return worldMeta.constructor
	} else {
		return worldMeta
	}
}

export function assertMethodConvention( worldMeta: WorldMeta, info: string, mustBeStatic: boolean )
{
	const isStatic = metaIsConstructor( worldMeta )
	if ( isStatic != mustBeStatic ) {
		expect.fail( isStatic, mustBeStatic, `${info} ${mustBeStatic ? 'must' : 'may not'} be a static member.` )

	}
	return isStatic
}
