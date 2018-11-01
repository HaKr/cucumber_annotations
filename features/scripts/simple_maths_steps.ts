
import { Given, When, Then, Before, After } from "../../src/metadata"

import { expect } from 'chai'

export class SimpleMathWorld
{
	private result = 0
	private metadata: any

	@Before()
	logMetaBefore() { console.log( 'Before:', this.metadata ) }

	@After()
	logMetaAfter() { console.log( 'After:', this.metadata ) }

	@Given( 'a variable set to {int}' )
	setTo( n: number ) { this.result = n }

	@When( 'I increment the variable by {int}' )
	incrementBy( n: number ) { this.result += n }

	@Then( 'the variable should contain {int}' )
	shouldBe( n: number ) { expect( this.result ).to.eql( n ) }

}
