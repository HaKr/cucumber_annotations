import { expect } from 'chai'
import { CustomWorld } from './custom_world'
import { StepsWorld } from './steps_world'
import * as Meta from './meta'


class WorldsCollection extends Map<String, AnnotatedWorld>{
    
    create( customWorld: CustomWorld ){
        this.forEach( (annotatedWorld) => annotatedWorld.create( customWorld ) )
    }
    
    getWorldByConstructor( worldConstructor: Function ) {
        return this.getWorldByMeta( <Meta.WorldConstructor>worldConstructor )
    }

    getWorldByMeta( worldMeta: Meta.WorldMeta ) {

        const constructor = Meta.getConstructor( worldMeta )
        let result = this.get( constructor.name )

        if ( result == undefined ) {
            result = new AnnotatedWorld( constructor )
            this.set( constructor.name, result )
        }

        return result
    }
}

export const WorldsMap = new WorldsCollection()

export class AnnotatedWorld {
    public readonly name: string

    constructor( readonly worldConstructor: Meta.WorldConstructor ) {
        this.name = worldConstructor.name
    }

    protected instance: StepsWorld | null = null
    protected customWorld: CustomWorld | null = null

    get world() { return this.instance }

    create( customWorld: CustomWorld ) {
        this.customWorld = customWorld
        this.instance = new this.worldConstructor()
        this.instance instanceof StepsWorld && this.instance.setCustomWorld( customWorld )
    }

    /**
     * wrapper for a steps world method, so that it will report the correct arity to CucumberJS, as CucumberJS's Step runner 
     * actively checks the length property to match the number of found parameters in the pattern
     * @param stepName
     * @param stepMethodName
     * @param arity
     */
    createDelegatedCucumberJSMethod( stepMethodName: string, stepMethod: Function ) {
        const self = this
        const result = function( this: CustomWorld, ...args: any[] ) {
            expect( this, 'different engines' ).to.be.equal( self.customWorld )
            expect( self.instance, 'World was not created yet' ).to.be.not.null
            stepMethod.call( self.instance, ...args )
        }
        Object.defineProperties( result, {
            'length': { value: stepMethod.length },
            'name': { value: `delegate_to_${self.worldConstructor.name}_${stepMethodName}` }
        } )
        return result
    }

}