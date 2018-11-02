
import { Given, When, Then, Type } from "../../src/index"

import { expect } from 'chai'

const NUMBERS_IN_WORDS = ['one', 'two', 'three']
const NUMBERS_IN_WORDS_PATTERN = RegExp( NUMBERS_IN_WORDS.join( '|' ) )

export class SimpleMathWorld
{
	private result = 0

	@Type( 'number_in_words', NUMBERS_IN_WORDS_PATTERN )
	wordToNumber( text: string ) { return NUMBERS_IN_WORDS.indexOf( text ) + 1 }

	@Given( 'a variable set to {int}' )
	setTo( n: number ) { this.result = n }

	@When( 'I increment the variable by {int}' )
	incrementBy( n: number ) { this.result += n }

	@Then( 'the variable should contain {int}' )
	@Then( 'the variable in words would read {number_in_words}' )
	shouldBe( n: number ) { expect( this.result ).to.eql( n ) }
}
