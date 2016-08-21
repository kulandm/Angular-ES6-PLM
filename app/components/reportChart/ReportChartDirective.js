'use strict';

/**
 * @ngdoc directive
 * @name Directives.reportChart
 * @restrict E
 *
 * @description This directive generates a chart by fetching
 * ####- reportObj: An instance of {@link plm.models.Report} that will be used to render a chart.
 * ####- isModal: true, if chart is opening is modal window.
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *	<doc:source>
 *		<ReportChart id="12355" chartType="COLUMN"></ReportChart>
 *	</doc:source>
 * </doc:example>
 *
 */

angular.module('plm360.reportChart').directive('reportChart', [
	function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				reportObj: '=',
				isModal: '@'
			},
			controller: 'ReportChartController',
			templateUrl: 'components/reportChart/reportChart.html',
			link: function (scope, element, attrs, ReportChartController) {
				// Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
				// In order to use this way of finding whether DOM is ready, we need to observe a scope property used by this directive in its template.
				attrs.$observe('chartRender', function (value) {
					if (value === 'true') {
						ReportChartController.init();
					}
				});

				scope.$isRendered = true;
			}
		};
	}
]);
