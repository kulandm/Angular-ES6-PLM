/**
 * @ngdoc directive
 * @name Directives.SectionWrapper
 * @restric E
 *
 * @description This directive builds the section that contains collapsible content
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<section-wrapper collapsible="" collapsed="" header-title=""></section-wrapper>
 *   </doc:source>
 * </doc:example>
 */

const LOG = new WeakMap();
const TIMEOUT = new WeakMap();
const UNDERSCORE = new WeakMap();

class SectionWrapper {

	/**
	* @ngdoc method
	* @name Directives.SectionWrapper#constructor
	* @methodOf Directives.SectionWrapper
	* @description The class constructor
	*/
	constructor($timeout, $log, _) {
		this.replace = true;
		this.restrict = 'E';
		this.scope = {
			headerTitle: '@',
			headerNormal: '=',
			headerTooltip: '@',
			collapsible: '=',
			collapsed: '@',
			actionIcons: '=',
			actionHandler: '&',
			classificationPartUrn: '@',
			classificationIsEdition: '='
		};
		this.templateUrl = 'sectionWrapper.html';
		this.transclude = true;

		LOG.set(this, $log);
		TIMEOUT.set(this, $timeout);
		UNDERSCORE.set(this, _);

	}

	/**
	* @ngdoc method
	* @name Directives.SectionWrapper#link
	* @methodOf Directives.SectionWrapper
	* @description The directive's link function
	*
	*/
	link(scope, element, attrs) {

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#classificationPartUrn
		* @propertyOf Directives.SectionWrapper
		* @description holds the section urn in case that exists
		*/
		scope.classificationPartUrn = angular.isDefined(attrs.classificationPartUrn) ? attrs.classificationPartUrn : null;

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#isHeaderNormal
		* @propertyOf Directives.SectionWrapper
		* @description Determines if whether the font wheight of the <h4> should be normal or not
		*
		*/
		scope.isHeaderNormal = angular.isDefined(attrs.headerNormal);

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#isCollapsible
		* @propertyOf Directives.SectionWrapper
		* @description Controls if the section can be collapsed.
		*
		*/
		scope.isCollapsible = angular.isDefined(attrs.collapsible);

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#isCollapsed
		* @propertyOf Directives.SectionWrapper
		* @description Controls the state of the section (if it is collapsed/expanded)
		*
		*/
		scope.isCollapsed = true;

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#panelHeight
		* @propertyOf Directives.SectionWrapper
		* @description Stores the panel height when it's first rendered
		*
		*/
		let panelHeight = 0;

		/**
		* @ngdoc property
		* @name Directives.SectionWrapper#panelHeight
		* @propertyOf Directives.SectionWrapper
		* @description Stores the panel height when it's first rendered
		*
		*/
		let transcludedWrapper;

		/**
		* @ngdoc method
		* @name Directives.SectionWrapper#animationFinishedListener
		* @methodOf Directives.SectionWrapper
		* @description `private` Listener for the animation, when it's completed, to add/remove the classes accordingly
		*
		*/
		let animationFinishedListener = () => {
			angular.element(transcludedWrapper).removeClass('animation');

			if (!scope.isCollapsed) {
				addInlineHeight('auto');
				angular.element(transcludedWrapper).addClass('expanded');
			} else {
				angular.element(transcludedWrapper).addClass('collapsed');
			}
		};

		/**
		* @ngdoc method
		* @name Directives.SectionWrapper#addInlineHeight
		* @methodOf Directives.SectionWrapper
		* @description `private` A helper method to add inline height to the collapsible section
		*
		* @param {String/Integer} newH The new inline height
		*
		*/
		let addInlineHeight = (newH) => {
			angular.element(transcludedWrapper).css({
				height: newH
			});
		};

		// A timeout for the passed attribute, which is only available once the directive has rendered
		TIMEOUT.get(SectionWrapper.instance)(() => {
			transcludedWrapper = element[0].querySelector('.transcluded-content-wrapper');
			transcludedWrapper.addEventListener('transitionend', animationFinishedListener);

			panelHeight = transcludedWrapper.scrollHeight; // Stores the panel height, for later use

			angular.element(transcludedWrapper).addClass('static-dynamic-expandCollapse');

			scope.isCollapsed = (scope.collapsed === 'true');

			if (scope.isCollapsed) {
				addInlineHeight(0);
				angular.element(transcludedWrapper).addClass('collapsed');
			} else {
				addInlineHeight('auto');
				angular.element(transcludedWrapper).addClass('expanded');
			}
		}, 500); // Need to use 500 here to Firefox/IE11 to keep up. This wouldn't be necessary otherwise, but apparently with directives in ES6, things are handled differently internally

		/**
		* @ngdoc method
		* @name Directives.SectionWrapper#togglePanel
		* @methodOf Directives.SectionWrapper
		* @description Toggles the panel with the transcluded content, setting the height accordingly
		*
		*/
		scope.togglePanel = (evt) => {

			if (scope.isCollapsible) {
				// Re-add height, because it was 'auto' before, which breaks the CSS transition
				if (scope.wasCwsTagClicked(evt)) {
					return;
				}
				if (!scope.isCollapsed) {
					panelHeight = transcludedWrapper.scrollHeight; // Stores the panel height, for later use (this is duplicated here as a Firefox/IE11 workaround)
					addInlineHeight(panelHeight + 'px');
				}

				// Remove all existing classes, and add animation class
				TIMEOUT.get(SectionWrapper.instance)(() => {
					angular.element(transcludedWrapper).removeClass('collapsed').removeClass('expanded').addClass('animation');
				}, 25);

				if (scope.isCollapsed) { // It's collapsed, therefore add the calculated height, and add the animation class
					TIMEOUT.get(SectionWrapper.instance)(() => { // Needs a timeout for DOM reflow to trigger after removing the classes above
						addInlineHeight(panelHeight + 'px');
					}, 50);
				} else { // It's expanded, therefore add the height 0
					TIMEOUT.get(SectionWrapper.instance)(() => { // Needs a timeout for DOM reflow to trigger after removing the classes above
						addInlineHeight(0);
					}, 50);
				}

				scope.isCollapsed = !scope.isCollapsed;
			}
		};
		// Avoid collapse the panel when click on the cws link to open the cws modal iframe
		scope.wasCwsTagClicked = (evt) => {
			return evt.target.className === 'cwsTreeIframe ng-binding';
		};

		/**
		* @ngdoc method
		* @name Directives.SectionWrapper#triggerAction
		* @methodOf Directives.SectionWrapper
		* @description Fires the function associated with a particular action button
		* on the collapsible header. We need this so that we can stop the click event
		* propagation otherwise the header expand/collapse will also occur simultaneously.
		*
		* @param {Object} event The event broadcast by the action
		* @param {String} actionName The action executed
		*
		*/
		scope.triggerAction = (event, actionName) => {
			event.stopPropagation();
			scope.actionHandler()(actionName);
		};
	}

	/**
	* @ngdoc method
	* @name Directives.SectionWrapper#directiveFactory
	* @methodOf Directives.SectionWrapper
	* @description The directive factory
	*
	*/
	static directiveFactory($timeout, $log, _) {
		SectionWrapper.instance = new SectionWrapper($timeout, $log, _);
		return SectionWrapper.instance;
	}
}

SectionWrapper.directiveFactory.$inject = ['$timeout', '$log', '_'];

export default SectionWrapper;
