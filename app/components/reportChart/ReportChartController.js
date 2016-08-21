'use strict';

/**
 * @ngdoc object
 * @name Controllers.ReportChartController
 *
 * @description This controller is responsible for logics of report chart directive
 *
 * ##Dependencies
 * - Requires {@link Services.LocalizationService}
 *
 */
angular.module('plm360.reportChart').controller('ReportChartController', [
	'$scope',
	'$rootScope',
	'$q',
	'$filter',
	'LocalizationService',
	'_',
	'$modal',
	'ReportChartConstants',
	function ($scope, $rootScope, $q, $filter, LocalizationService, _, $modal, ReportChartConstants) {

		// Grab the scope of this to be called inside $scope.init
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.ReportChartController#bundle
		 * @propertyOf Controllers.ReportChartController
		 * @description localization bundle
		 */
		$scope.bundle = {};

		/**
		 * @ngdoc property
		 * @name Controllers.ReportChartController#chartConfig
		 * @propertyOf Controllers.ReportChartController
		 * @description The chart configuration option to be used with high charts directive. Note: Need to set some default
		 * values to avoid showing default title and other options when chart config is being loaded.
		 */
		$scope.chartConfig = {
			title: {
				text: null
			},
			options: {
				exporting: {
					enabled: false
				}
			},
			loading: true
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#init
		 * @methodOf Controllers.ReportChartController
		 * @description Initialization function
		 */
		$scope.init = function () {
			that.init();
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createCategoryList
		 * @methodOf Controllers.ReportChartController
		 * @description create list of categories from the given chart data.
		 *
		 * @param {String} axisId : the id of the axis on which the category will be created. Note: Generally for reports it will be x-axis.
		 * @param {Object} chartData : the chart data for the report.
		 *
		 * @return {Array} list of categories for the chart.
		 * @private
		 */
		that.createCategoryList = function (axisId, chartData) {
			var axisCategories = [];
			_.each(chartData, function (row) {
				var dataPoint = _.find(row.fields.entry, function (entry) {
					return entry.key.toString() === axisId;
				});

				var categoryValue = dataPoint ? $filter('escapeHtmlEntities')(dataPoint.fieldData.value) : ReportChartConstants.NO_VALUE;

				if (!_.contains(axisCategories, categoryValue)) {
					axisCategories.push(categoryValue);
				}
			});

			return axisCategories;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createSeriesMap
		 * @methodOf Controllers.ReportChartController
		 * @description create a map of series from the chart data.
		 *
		 * @param {String} seriesId : the id of the series (this will be the key of the resultant map).
		 * @param {Object} chartData : the chart data for the report.
		 *
		 * @return {Object} map of series keyyed by series id
		 * NOTE: its valid to have an empty string as series id. What should we do if we have multiple series with empty string id??
		 * @private
		 */
		that.createSeriesMap = function (seriesId, chartData) {
			return _.groupBy(chartData, function (row) {
				var dataPoint = _.find(row.fields.entry, function (entry) {
					return entry.key.toString() === seriesId;
				});
				return dataPoint ? dataPoint.fieldData.value : '';
			});
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createInitialDataSetForSeries
		 * @methodOf Controllers.ReportChartController
		 * @description create default data list for a series. This method will be used with {@link #createSeries}.
		 *
		 * @param {Number} initialValue : initial value to be set to the list.
		 * @param {Number} length : the length of the list. Note: In the context of series, this should be the length of categories.
		 *
		 * @return {Array} list with default values.
		 * @private
		 */
		that.createInitialDataSetForSeries = function (initialValue, length) {
			var list = [];

			_.times(length, function (index) {
				list.push(initialValue);
			});

			return list;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createSeries
		 * @methodOf Controllers.ReportChartController
		 * @description create list of series of the report.
		 *
		 * @param {Object} seriesMap : a map keyed by series name and value is the list of values for categories.
		 *                              Note: list does not necessary contain value for each category, so this method will
		 *                              fill the missing values with default values.
		 * @param {Array} categoryList : list of strings representing the category for the report chart.
		 * @param {String} dependentAxisId : the dependent axis id (it can be x-axis or y-axis depending on the chart data)
		 * @param {String} independentAxisId : the independent axis id (it can be a-axis or y-axis depennding on the chart data).
		 * @param {Number/String} defaultValue : the default value to set to the series data list.
		 *
		 * @return {Array} the list of series for the report chart.
		 * @private
		 */
		that.createSeries = function (seriesMap, categoryList, dependentAxisId, independentAxisId, defaultValue) {
			var seriesList = [];

			var seriesKeys = _.keys(seriesMap);

			_.each(seriesKeys, function (key) {
				var seriesDataSet = that.createInitialDataSetForSeries(defaultValue, categoryList.length);

				_.each(seriesMap[key], function (row) {

					var dependentPoint = _.find(row.fields.entry, function (entry) {
						return entry.key.toString() === dependentAxisId;
					});

					var independentPoint = _.find(row.fields.entry, function (entry) {
						return entry.key.toString() === independentAxisId;
					});

					var index = _.indexOf(categoryList, dependentPoint ? dependentPoint.fieldData.value : ReportChartConstants.NO_VALUE);
					seriesDataSet[index] = independentPoint ? parseInt(independentPoint.fieldData.value) : defaultValue;
				});

				seriesList.push({
					name: $filter('escapeHtmlEntities')(key || ReportChartConstants.NO_VALUE),
					data: seriesDataSet
				});
			});
			return seriesList;
		};

		/**
		 * ngdoc method
		 * @name Controllers.ReportChartController#createSeriesForAggregates
		 * @methodOf Controllers.ReportChartController
		 * @description create list of series for the report. This is a variant of {@link #createSeries} to deal with a scenario
		 * where we have aggregates fields for both series and y-axis.
		 *
		 * @param {Object} data : the chart data for the report.
		 * @param {String} firstSeriesId : the id of the field representing series.
		 * @param {String} firstSeriesName : the name / label of the series
		 * @param {String} secondSeriesId : the id of the field representing y-axis
		 * @param {String} secondSeriesName : the name / label of y-axis.
		 *
		 * @return {Array} the list of series for the report chart.
		 * @private
		 */
		that.createSeriesForAggregates = function (data, firstSeriesId, firstSeriesName, secondSeriesId, secondSeriesName) {
			var chartData = [];
			chartData.push({
				name: $filter('escapeHtmlEntities')(firstSeriesName),
				data: []
			});
			chartData.push({
				name: $filter('escapeHtmlEntities')(secondSeriesName),
				data: []
			});

			_.each(data, function (row) {
				var dataPoint1 = _.find(row.fields.entry, function (entry) {
					return entry.key.toString() === firstSeriesId;
				});

				var dataPoint2 = _.find(row.fields.entry, function (entry) {
					return entry.key.toString() === secondSeriesId;
				});

				chartData[0].data.push(dataPoint1 ? parseInt(dataPoint1.fieldData.value) : null);
				chartData[1].data.push(dataPoint2 ? parseInt(dataPoint2.fieldData.value) : null);
			});

			return chartData;
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createId
		 * @methodOf Controllers.ReportChartController
		 * @description create field id based on field object.
		 *
		 * @param {Object} field : field associated with the report.
		 *
		 * @return {String} the id of the field based on {@link #fieldID} and optionally {@link #aggregate} properties.
		 * Note: we need to incorporate {@link #aggregate} as reportResult column id will have the aggregate property as part of field ID.
		 * @private
		 */
		that.createId = function (field) {
			return field.fieldID + (field.aggregate ? '__' + field.aggregate : '');
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#createFieldDescriptor
		 * @methodOf Controllers.ReportChartController
		 * @description create field descriptor on field object.
		 *
		 * @param {Object} field : field associated with the report.
		 *
		 * @return {String} the descriptor of the field based on {@link #fieldID} and optionally {@link #aggregate} properties.
		 * Note: we need to incorporate {@link #aggregate} as reportResult column id will have the aggregate property as part of field ID.
		 * @private
		 */
		that.createFieldDescriptor = function (field) {
			return field.fieldID + (field.aggregate ? ' (' + field.aggregate : ')');
		};

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#isRendered
		 * @propertyOf Controllers.ReportChartController
		 * @description true, when report chart directive is rendered.
		 */
		var isRendered = false;

		$scope.$watch('reportObj', function (newVal, oldVal) {
			if (!angular.equals(newVal, oldVal) && isRendered === true) {
				that.init();
			}
		});

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#init
		 * @methodOf Controllers.ReportChartController
		 * @description Initialization function
		 */
		that.init = function () {

			isRendered = true;

			if (!angular.isDefined($scope.reportObj)) {
				return;
			}

			// Initialize the localization bundle
			LocalizationService.init().then(function () {
				$scope.bundle = $rootScope.bundle;

				if ($scope.reportObj !== null) {

					// Load the chart data
					$scope.chartData = [];
					$scope.chartLabels = [];
					$scope.seriesLabel = '';
					$scope.yAxisLabel = '';
					$scope.xAxisLabel = '';
					$scope.chartName = $filter('escapeHtmlEntities')($scope.reportObj.getTitle());
					$scope.chartType = $scope.reportObj.getType();

					var data = $scope.reportObj.getFullList();

					/**
					 * @ngdoc property
					 * @name Controllers.ReportChartController#isMultiSeriesOrStacked
					 * @methodOf Controllers.ReportChartController
					 * @description true, if chart is either multiseries or stacked
					 */
					var isMultiSeriesOrStacked = false;

					if (angular.isDefined(data.reportResult) && angular.isDefined(data.reportResult.row)) {
						$scope.xAxisLabel = data.reportDefinition.reportChart.chartXaxisLabel || '';
						$scope.yAxisLabel = data.reportDefinition.reportChart.chartYaxisLabel || '';
						$scope.seriesLabel = data.reportDefinition.reportChart.chartSeriesLabel || '';

						// We need different data structure for different types of chart
						switch ($scope.chartType) {
							case 'MSLINE':
							case 'MSAREA':
							case 'MSCOLUMN':
							case 'STACKEDCOLUMN':
							case 'STACKEDAREA':
								isMultiSeriesOrStacked = true;
								var xAxisId = that.createId(data.reportDefinition.reportChart.xAxisField);
								var yAxisId = that.createId(data.reportDefinition.reportChart.yAxisField);

								var seriesId;
								if (data.reportDefinition.reportChart.xAxisSeriesField) {
									seriesId = that.createId(data.reportDefinition.reportChart.xAxisSeriesField);
									$scope.seriesLabel = $scope.seriesLabel || data.reportDefinition.reportChart.xAxisSeriesField.fieldName || '';
									$scope.categories = that.createCategoryList(xAxisId, data.reportResult.row);
									$scope.chartData = that.createSeries(
										that.createSeriesMap(seriesId, data.reportResult.row),
										$scope.categories,
										xAxisId,
										yAxisId,
										$scope.chartType === 'MSCOLUMN' || $scope.chartType === 'STACKEDCOLUMN' ? null : 0);
								} else {
									seriesId = that.createId(data.reportDefinition.reportChart.yAxisSeriesField);
									$scope.seriesLabel = $scope.seriesLabel || data.reportDefinition.reportChart.yAxisSeriesField.fieldName || '';

									$scope.categories = that.createCategoryList(xAxisId, data.reportResult.row);
									$scope.chartData = that.createSeriesForAggregates(data.reportResult.row,
										seriesId,
										that.createFieldDescriptor(data.reportDefinition.reportChart.yAxisSeriesField),
										yAxisId,
										that.createFieldDescriptor(data.reportDefinition.reportChart.yAxisField)
									);
								}
								break;

							default:
								// TODO: needs more refactoring for default supported charts.
								_.each(data.reportResult.row, function (row, rowIndex) {
									if (row.fields.entry.length === 1) {
										$scope.chartData.push({
											name: ReportChartConstants.NO_VALUE,
											y: parseInt(row.fields.entry[0].fieldData.value)
										});
									} else {
										$scope.chartData.push({
											name: $filter('escapeHtmlEntities')(row.fields.entry[0].fieldData.value),
											y: parseInt(row.fields.entry[1].fieldData.value)
										});
									}
								});

								// Do extra massaging if it's pie/doughnut chart
								if ($scope.chartType === 'PIE' || $scope.chartType === 'DOUGHNUT') {
									// Get the total value
									var total = _.reduce($scope.chartData, function (memo, ele) {
										return memo + ele.y;
									}, 0);

									// Group the data according to name
									var groupData = _.groupBy($scope.chartData, function (ele) {
										return ele.name;
									});

									// Get all the key names
									var keys = _.keys(groupData);

									// Empty array to store final chartData
									var dataList = [];

									_.each(keys, function (key, ind) {
										var reduceY = _.reduce(groupData[key], function (memo, ele) {
											return memo + ele.y;
										}, 0);
										dataList.push({
											name: keys[ind],
											y: reduceY / total * 100 // Get the percentage
										});
									});

									$scope.chartData = dataList;
								} else {
									$scope.categories = _.pluck($scope.chartData, 'name');
								}

								$scope.chartData = [{
									data: $scope.chartData
								}];
								break;
						}
					}

					/**
					 * @ngdoc property
					 * @name Controllers.ReportChartController#useTicks
					 * @methodOf Controllers.ReportChartController
					 * @description true, if ticks will be used on x-Axis (independent axis) instead of categories. For line and area
					 * charts, ticks should be used.
					 */
					var useTicks = false;

					if ($scope.chartType === 'LINE' || $scope.chartType === 'MSLINE' || $scope.chartType === 'AREA' ||
						$scope.chartType === 'MSAREA' || $scope.chartType === 'STACKEDAREA') {
						useTicks = true;
					}

					$scope.chartConfig = {
						loading: false,
						noData: $scope.bundle.chart.noDataToShow,
						options: {
							chart: {
								type: $scope.chartType.toLowerCase(),
								spacingTop: $scope.isModal === 'true' ? 50 : 10
							},
							colors: ['#40a9dd', '#fab11c', '#77bd0d', '#e2580b', '#727272', '#9c73dd', '#ce7057', '#ce7eb6'],
							credits: {
								enabled: false
							},
							exporting: {
								buttons: {
									contextButton: {
										y: $scope.isModal === 'true' ? -50 : 0
									}
								}
							},
							tooltip: {
								pointFormat: ($scope.chartType === 'PIE' || $scope.chartType === 'DOUGHNUT') ? '<b>{point.y}</b>%' : '<b>{point.y}</b>'
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									dataLabels: {
										enabled: false
									},
									showInLegend: false
								},
								column: {
									groupPadding: 0.1,
									dataLabels: {
										enabled: false
									},
									showInLegend: $scope.isModal === 'true' && isMultiSeriesOrStacked === true ? true : false,
									colorByPoint: true,
									colors: ['#40a9dd', '#fab11c', '#77bd0d', '#e2580b', '#727272', '#9c73dd', '#ce7057', '#ce7eb6']
								},
								line: {
									dataLabels: {
										enabled: false
									},
									showInLegend: $scope.isModal === 'true' && isMultiSeriesOrStacked === true ? true : false
								},
								area: {
									dataLabels: {
										enabled: false
									},
									showInLegend: $scope.isModal === 'true' && isMultiSeriesOrStacked === true ? true : false
								}
							},
							xAxis: {
								title: {
									text: $scope.isModal === 'true' && $scope.xAxisLabel ? $scope.xAxisLabel : null,
									style: {
										fontWeight: 'bold'
									}
								},
								labels: {
									rotation: -30,
									overflow: 'justify',
									// Add truncation styles to long labels
									style: {
										width: '80px',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									},
									// Include tooltip for labels (since labels can be truncated)
									formatter: function () {
										var value = useTicks ? $scope.categories[this.value] : this.value;
										return '<span title="' + value + '">' + value + '</span>';
									},
									useHTML: true,
									// Make sure step is large enough so labels will not overlap
									step: ($scope.categories && $scope.categories.length > 20) ? Math.ceil($scope.categories.length / 20) : null,
									enabled: $scope.isModal === 'true' ? true : false
								},
								// These settings will impact only non category charts.
								tickInterval: 1,
								minPadding: 0,
								maxPadding: 0,
								startOnTick: true,
								endOnTick: true
							},
							yAxis: {
								title: {
									text: $scope.isModal === 'true' && $scope.yAxisLabel ? $scope.yAxisLabel : null,
									style: {
										fontWeight: 'bold'
									}
								},
								minRange: 0.15,
								min: data.reportDefinition.reportChart.yAxisMin,
								max: data.reportDefinition.reportChart.yAxisMax
							},
							legend: {
								enabled: $scope.isModal === 'true' ? true : false,
								title: {
									text: $scope.seriesLabel
								},
								borderWidth: 1,
								shadow: true
							}
						},
						title: {
							// Remove the chartname (since name is already there on modal header)
							text: $scope.isModal === 'true' ? null : ('<span title="' + $scope.chartName + '">' + $filter('escapeHtmlEntities')($scope.chartName) + '</span>'),
							style: {
								textAlign: 'center',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								paddingRight: '20px'
							},
							useHTML: true
						},
						series: $scope.chartData
					};

					// We need different options in configuration for different types of charts
					switch ($scope.chartType) {
						case 'PIE':
							break;
						case 'DOUGHNUT':
							$scope.chartConfig.options.chart.type = 'pie';
							$scope.chartConfig.series[0].innerSize = '40%';
							break;
						case 'LINE':
							break;
						case 'AREA':
							break;
						case 'COLUMN':
							angular.extend($scope.chartConfig.options.xAxis, {
								categories: $scope.categories
							});
							break;
						case 'MSLINE':
							$scope.chartConfig.options.chart.type = 'line';
							$scope.chartConfig.options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
							break;
						case 'MSAREA':
							$scope.chartConfig.options.chart.type = 'area';
							$scope.chartConfig.options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
							break;
						case 'MSCOLUMN':
							angular.extend($scope.chartConfig.options.xAxis, {
								categories: $scope.categories
							});
							$scope.chartConfig.options.chart.type = 'column';
							$scope.chartConfig.options.plotOptions.column.colorByPoint = false;
							$scope.chartConfig.options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
							break;
						case 'STACKEDCOLUMN':
							angular.extend($scope.chartConfig.options.xAxis, {
								categories: $scope.categories
							});
							$scope.chartConfig.options.chart.type = 'column';
							$scope.chartConfig.options.plotOptions.column.stacking = 'normal';
							$scope.chartConfig.options.plotOptions.column.colorByPoint = false;
							$scope.chartConfig.options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
							break;
						case 'STACKEDAREA':
							$scope.chartConfig.options.chart.type = 'area';
							$scope.chartConfig.options.plotOptions.area.stacking = 'normal';
							$scope.chartConfig.options.tooltip.pointFormat = '{series.name}: <b>{point.y}</b>';
							break;
						default:
							break;
					}

					$scope.chartConfig.options.chart.animation = {
						duration: 1500
					};

					// If not in modal, add the enlargeButton
					// NOTE: temporarily commented-out because it was broken after Galileo-related changes
					// if ($scope.isModal !== 'true') {
					// 	angular.extend($scope.chartConfig.options.exporting, {
					// 		buttons: {
					// 			enlargeButton: {
					// 				onclick: function () {
					// 					var parentScope = $scope;

					// 					$modal.open({
					// 						templateUrl: 'components/reportChart/reportChartModal.html',
					// 						size: 'lg',
					// 						controller: 'ReportChartModal',
					// 						windowClass: 'report-chart-modal',
					// 						backdrop: 'static',
					// 						resolve: {
					// 							reportObj: function () {
					// 								return parentScope.reportObj;
					// 							},
					// 							title: function () {
					// 								return parentScope.chartName;
					// 							}
					// 						}
					// 					});
					// 				},
					// 				symbol: 'url(images/maximize_16.png)'
					// 			}
					// 		}
					// 	});
					// }

				} else {
					// The reportObj returned as null so we show a proper message instead of the chart
					$scope.chartConfig = {
						loading: false,
						noData: $scope.bundle.chart.dataErrorMessage,
						title: {text: $scope.bundle.chart.dataErrorTitle},
						series: [],
						credits: {enabled: false},

						// @TODO Revisit
						// Something like this should hide the top button from the chart, but in fact
						// it is not working for some reason.
						exporting: {
							enabled: false,
							buttons: {
								exportButton: {
									enabled: false
								},
								printButton: {
									enabled: false
								}
							}
						}
					};
				}

			});
		};
	}
]).controller('ReportChartModal', [
	'$scope',
	'$modalInstance',
	'$timeout',
	'reportObj',
	'title',
	function ($scope, $modalInstance, $timeout, reportObj, title) {

		$scope.title = title;

		// TODO: need to re-evaluate that. Bootstrap's modal is not smart enough to tell us whether the modal is rendered or not.
		// This is causing problems with charts. Moving forward, we should create our won't modal (like we have created a flyout,
		// which have a better way of telling whether the flyout is rendered or not).
		$timeout(function () {
			$timeout(function () {
				$scope.reportObj = reportObj;
			}, 0);
		}, 0);

		/**
		 * @ngdoc method
		 * @name Controllers.ReportChartController#closeChartModal
		 * @methodOf Controllers.ReportChartController
		 * @description Closes the modal window when clicking the close button
		 *
		 */
		$scope.closeChartModal = function () {
			$modalInstance.close();
		};

		// Note this is a work around to ensure the chart fits the print page.
		// Based on {@link http://stackoverflow.com/questions/18500476/resize-a-chart-before-printing-with-highcharts}.
		// TODO: need to reevaluate this for a better solution.
		/* global Highcharts */
		Highcharts.wrap(Highcharts.Chart.prototype, 'print', function (proceed) {
			var that = this;
			var chartWidth = that.chartWidth;   // Save original chart width
			var chartHeight = that.chartHeight; // Save original chart height

			this.setSize(600, 400, false); // Set chart size for print
			proceed.call(this);

			// Set chart size back to modal size
			$timeout(function () {
				that.setSize(chartWidth, chartHeight, false);
			}, 0);
		});
	}
]);
