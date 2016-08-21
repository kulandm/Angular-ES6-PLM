/**
 * @ngdoc object
 * @name ViewTestsComponents.WorkflowTransitionFlyout
 *
 * @description This component corresponds to the workflow transition flyout function
 *
 * ##Dependencies
 *
 */
function WorkflowTransitionFlyout() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#actionsDropdown
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description Action dropdown coming on top right of the application
	 */
	this.actionsDropdown = element(by.css('#itemviewer-menu-dropdown-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#workFlowTransitionLink
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description Link coming as workflow transition in the actions dropdown overlay
	 */
	this.workFlowTransitionLink = element(by.css('.workflow-transition-link'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#cancelTransitionButton
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description Cancel button in the actions dropdown overlay
	 */
	this.cancelTransitionButton = element(by.css('.cancel-transition'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#workflowWorkflowTransitionFlyoutTransitionSelect
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The select drop down in the actions dropdown overlay
	 */
	this.workflowTransitionSelect = element(by.css('#workflow-transition-select'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#noTransitionDescription
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description Container when there are no transitions
	 */
	this.noTransitionDescription = element(by.css('.no-transitions'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#transitionOptionList
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The select dropdown of the list of transitions
	 */
	this.transitionOptionList = element.all(by.repeater('transition in workflowTransitions'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#actAsLabel
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The act as label coming the actions dropdown overlay
	 */
	this.actAsLabel = element(by.css('.act-as-container label'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#actAsDropdown
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The select component which has the list of act as users
	 */
	this.actAsDropdown = element(by.css('.act-as-container select'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#comment
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The textarea for comments
	 */
	this.comments = element(by.css('.workflow-flyout textarea'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#saveButton
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description The save button in the flyout
	 */
	this.saveButton = element(by.css('.workflow-flyout .save-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#flyout
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description It is the workflow transition flyout
	 */
	this.flyout = element(by.css('.workflow-flyout'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.WorkflowTransitionFlyout#actAsDropdownOption
	 * @propertyOf ViewTestsComponents.WorkflowTransitionFlyout
	 * @description It is options for act as dropdown
	 */
	this.actAsDropdownOption = element.all(by.css('.act-as-container select option'));
}

module.exports = new WorkflowTransitionFlyout();
