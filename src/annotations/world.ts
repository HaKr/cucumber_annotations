import '../worlds/custom_world'
//import * as Meta from '../worlds/meta'
//import * as StepsWorld from '../worlds/steps_world'


export class Abc
{
	public jjdk: string = 'JJdK'
}

export function World<T extends { new( ...args: any[] ): {} }>( worldMeta: T )
{
	//	const WorldConstructor = Meta.metaIsConstructor( worldMeta ) ? worldMeta : worldMeta.constructor
	return class extends worldMeta
	{
		public xyz = 42
	}
}