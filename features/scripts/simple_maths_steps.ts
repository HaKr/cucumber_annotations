import * as Cucumber from "../../../cucumber_annotations"
import { expect } from 'chai'

export class SimpleMathWorld {
  private result = 0
  
//  @Cucumber.BeforeAll()
//  static wakeup(){ console.log('Before all')}
//  
//  @Cucumber.Type( 'ordinal', /(\w+(st|nd|rd|th))\b/, {useForSnippets: false} ) 
//  ordinalType( ordinalName: string ) { return ordinalToNumber( ordinalName ) }
  
  @Cucumber.Given( 'a variable set to {int}' )
  setTo( n: number ){ this.result = n  }
  
  @Cucumber.When('I increment the variable by {int}')
  incrementBy(n: number) { this.result += n  }
  
  @Cucumber.Then('the variable should contain {int}')
  shouldBe( n: number ) { expect(this.result).to.eql(n) }
}


//const
//   ORDINALS = [
//      'first', '1st',
//      'second', '2nd',
//      'third', '3rd',
//      'fourth', '4th',
//      'fifth', '5th',
//      'sixth', '6th'
//   ]
//
//function ordinalToNumber( ordinal: string ): number {
//   const result = ORDINALS.indexOf( ordinal ) >> 1
//
//   expect( result, `Unknown ordinal "${ordinal}"` ).to.be.greaterThan( -1 )
//   return result < 0 ? 0 : result
//}