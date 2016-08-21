/**
 * @ngdoc directive
 * @name Directives.wipAttachmentTooltip
 * @restrict A
 *
 * @description tooltip directive with support of auto-positioning
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *   	<div wip-attachment-tooltip="" prevent-default-tooltip>
 *		</div>
 *   </doc:source>
 * </doc:example>
 * Usage: For using this directive, you need to have the wip-attachment-tooltip as an attribute on the element on which you want the tooltip to appear
 * Since, it's based on ng-transclude so anything can be put inside the directive which would be accepted by the directive as content and shall be displayed
 * prevent-default-tooltip is provided with the value of 'true' and 'false' based upon if you want to show the tooltip or not
 */
function wipAttachmentTooltipDirective($timeout, $window) {
	return {
		restrict: 'A',
		templateUrl: 'components/wipAttachmentsTooltip/wipAttachmentsTooltip.html',
		transclude: true,
		link: (scope, element, attrs) => {
			/**
			 * @ngdoc property
			 * @name Directives.wipAttachmentTooltip#tooltipContent
			 * @propertyOf Directives.wipAttachmentTooltip
			 * @description Finding the tooltip content element
			 */
			let tooltipContent = $(element).find('.tooltip-content');

			/**
			 * @ngdoc property
			 * @name Directives.wipAttachmentTooltip#delay
			 * @propertyOf Directives.wipAttachmentTooltip
			 * @description This delay variable is used to ensure that the tooltip are coming when the user has the intent
			 * and not when the user is just moving his/her mouse without the intent of looking at the tooltip
			 */
			let delay;

			/**
			 * @ngdoc method
			 * @name Directives.wipAttachmentTooltip#positionTooltip
			 * @methodOf Directives.wipAttachmentTooltip
			 * @description Responsible for calculating the postion of the tooltip based upon the position of the originating element
			 *
			 * TODO: Add support for right and left positioning in future
			 */
			scope.positionTooltip = () => {
				// Below logic is to remove the duplicate title attribute shown by the field-selector
				let elementsWithTitle = $(element).find('[title]');
				
				_.each(elementsWithTitle, titleElement => {
					if (attrs.preventDefaultTooltip === 'true') {
						titleElement.title = '';
					}
				});

				delay = $timeout(() => {					
					let elementClientRec = element[0].getBoundingClientRect();
					let top = elementClientRec.top;
					let bottom = elementClientRec.bottom;

					// Calculating the visible height of the window which is the core thing for deciding the position of the tooltip 

					let visibleHeight = $window.innerHeight;

					let visibleHeightTop = visibleHeight - top;
					let visibleHeightBottom = visibleHeight - bottom;
					
					// The position is decided based upon the space available relative to the height of the tooltip content
					let tooltipPosition = ((visibleHeight - bottom) > (tooltipContent.height()) + 70) ? 'bottom' : 'top';

					tooltipContent.removeClass('bottom top').addClass(tooltipPosition);

				}, 300);
			};

			/**
			 * @ngdoc method
			 * @name Directives.wipAttachmentTooltip#hideTooltip
			 * @methodOf Directives.wipAttachmentTooltip
			 * @description Responsible for hiding the tooltip
			 *
			 */
			scope.hideTooltip = () => {
				$timeout.cancel(delay);
				tooltipContent.removeClass('bottom top');
			};
		}
	};
}

export default wipAttachmentTooltipDirective;
