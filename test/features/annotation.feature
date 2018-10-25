Feature: Use annotations

Scenario: Annotations are cool
	Given annotations are possible
	When John Developer annotates a method with Given 
	Then that method is called first for each scenario
	
	
Scenario: Annotations are nifty
	Given annotations are possible
	When John Developer annotates a method with When
	Then that method is called second for each scenario
	