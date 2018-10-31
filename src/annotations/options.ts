import * as CucumberJS from 'cucumber'

export interface AllScenarios extends CucumberJS.StepDefinitionOptions { }
export interface EachScenario extends CucumberJS.HookOptions { }
export interface ScenarioStep extends CucumberJS.StepDefinitionOptions { }
export interface Type {
    /** Defaults to true. That means this parameter type will be used to generate snippets for undefined stepIf 
     * the regexp frequently matches text you don't intend to be used as arguments, disable its use for snippets with false.
     */
    useForSnippets?:boolean,
    /** 
     *  Defaults to false. Set to true if you use regular expressions and you want this parameter type's regexp to take precedence over others during a match.
     * */
    preferForRegexpMatch?: boolean
}
