@anno2
Feature: Use annotations in a separate world

Scenario: Worlds apart
	Given there is a separate planet
	 When the sun shines
	 Then there will be light
	
Scenario: Worlds apart end
	Given there is a separate planet
	 When the sun fades
	 Then there will be twilight
	
Scenario: Worlds apart collides
	Given there is a separate planet
	 When John Developer annotates a method with Then
	  And the sun storms
	 Then there will be chaos
	  But the execution of the annotated method comes still as third
	