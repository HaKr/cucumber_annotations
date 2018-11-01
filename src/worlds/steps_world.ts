import { Metadata } from '../support/scenario_metadata'

export class StepsWorld
{
	protected metadata: Metadata

	setMetadata( meta: Metadata )
	{
		this.metadata = meta
	}
}
