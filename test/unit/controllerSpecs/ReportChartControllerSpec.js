'use strict';

// TODO: remove this unit test, as this controller is not in used. @Deprecated.
describe('ReportChartController', function () {

	var $controllerConstructor, mockReportService, mockModelsManager, mockReportsObj, mockLocalizationService, scope, q, timeout, d, underscore, httpBackend, mockLocalizationData;
	var chartData = [{
		reportDefinition: {
			reportChart: {
				type: 'PIE',
				title: 'Items by Pie'
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'pie chart name 1'}
					}, {
						fieldData: {value: '1'}
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'DOUGHNUT',
				title: 'Items by Doughnut'
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'doughnut chart name 1'}
					}, {
						fieldData: {value: '2'}
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'COLUMN',
				title: 'Items by Column'
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'column chart name 1'}
					}, {
						fieldData: {value: '3'}
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'LINE',
				title: 'Items by Line'
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'line chart name 1'}
					}, {
						fieldData: {value: '4'}
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'AREA',
				title: 'Items by Area'
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'area chart name 1'}
					}, {
						fieldData: {value: '5'}
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'MSLINE',
				title: 'Items by Line',
				xAxisField: {fieldID: 'test 1'},
				yAxisField: {fieldID: 'test 2'},
				xAxisSeriesField: {fieldID: 'test 3'}
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'line chart name 1'},
						key: 'test 1'
					}, {
						fieldData: {value: '4'},
						key: 'test 2'
					}, {
						fieldData: {value: 'dummy'},
						key: 'test 3'
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'MSAREA',
				title: 'Items by MS Area',
				xAxisField: {fieldID: 'test 1'},
				yAxisField: {fieldID: 'test 2'},
				xAxisSeriesField: {fieldID: 'test 3'}
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'MS area chart name 1'},
						key: 'test 1'
					}, {
						fieldData: {value: '4'},
						key: 'test 2'
					}, {
						fieldData: {value: 'dummy'},
						key: 'test 3'
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'MSCOLUMN',
				title: 'Items by MS Column',
				xAxisField: {fieldID: 'test 1'},
				yAxisField: {fieldID: 'test 2'},
				xAxisSeriesField: {fieldID: 'test 3'}
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'MS column chart name 1'},
						key: 'test 1'
					}, {
						fieldData: {value: '4'},
						key: 'test 2'
					}, {
						fieldData: {value: 'dummy'},
						key: 'test 3'
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'STACKEDCOLUMN',
				title: 'Items in Stacked Column',
				xAxisField: {fieldID: 'test 1'},
				yAxisField: {fieldID: 'test 2'},
				xAxisSeriesField: {fieldID: 'test 3'}
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'stacked column chart name 1'},
						key: 'test 1'
					}, {
						fieldData: {value: '4'},
						key: 'test 2'
					}, {
						fieldData: {value: 'dummy'},
						key: 'test 3'
					}]
				}
			}]
		}
	}, {
		reportDefinition: {
			reportChart: {
				type: 'STACKEDAREA',
				title: 'Items in Stacked Area',
				xAxisField: {fieldID: 'test 1'},
				yAxisField: {fieldID: 'test 2'},
				xAxisSeriesField: {fieldID: 'test 3'}
			}
		},
		reportResult: {
			row: [{
				fields: {
					entry: [{
						fieldData: {value: 'stacked area chart name 1'},
						key: 'test 1'
					}, {
						fieldData: {value: '4'},
						key: 'test 2'
					}, {
						fieldData: {value: 'dummy'},
						key: 'test 3'
					}]
				}
			}]
		}
	}];

	beforeEach(module('plm360','plm360.reportChart','com/autodesk/localization.js','plmTemplates'));

	/**
	 * Setup for each test cases
	 */
	beforeEach(function () {

		mockModelsManager = sinon.stub({
			getReports: function () {},
			getReport: function () {}
		});
		mockLocalizationService = sinon.stub({
			init: function () {},
			translate: function () {}
		});
		mockReportsObj = sinon.stub({
			getFullList: function () {}
		});

		mockLocalizationData = {};

		/**
		 * Inject the angular dependencies of the controller
		 * Save these in variables so they can be used in the test cases
		 */
		inject(function ($controller, $rootScope, $q, $timeout, _, $httpBackend) {
			q = $q;
			timeout = $timeout;
			scope = $rootScope;
			underscore = _;
			$controllerConstructor = $controller;
			httpBackend = $httpBackend;

			httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);
		});
	});

	describe('init', function () {
		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by PIE type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[0];
				},
				getTitle: function () {
					return 'Items by Pie';
				},
				getType: function () {
					return 'PIE';
				}
			};

			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			scope.bundle = {
				chart: {noDataToShow: 'No Data'}
			};
			locD.resolve();
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			scope.$digest();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('pie chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(100);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('pie');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Pie">Items by Pie</span>');
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by DOUGHNUT type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[1];
				},
				getTitle: function () {
					return 'Items by Doughnut';
				},
				getType: function () {
					return 'DOUGHNUT';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('doughnut chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(100);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('pie');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Doughnut">Items by Doughnut</span>');
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by LINE type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[3];
				},
				getTitle: function () {
					return 'Items by Line';
				},
				getType: function () {
					return 'LINE';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('line chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('line');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Line">Items by Line</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by MSLINE type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[5];
				},
				getTitle: function () {
					return 'Items by Line';
				},
				getType: function () {
					return 'MSLINE';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('line');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Line">Items by Line</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by AREA type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[4];
				},
				getTitle: function () {
					return 'Items by Area';
				},
				getType: function () {
					return 'AREA';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('area chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(5);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('area');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Area">Items by Area</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by MSAREA type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[6];
				},
				getTitle: function () {
					return 'Items by MS Area';
				},
				getType: function () {
					return 'MSAREA';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('area');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by MS Area">Items by MS Area</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by COLUMN type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[2];
				},
				getTitle: function () {
					return 'Items by Column';
				},
				getType: function () {
					return 'COLUMN';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('column chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(3);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('column');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by Column">Items by Column</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by MSCOLUMN type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[7];
				},
				getTitle: function () {
					return 'Items by MS Column';
				},
				getType: function () {
					return 'MSCOLUMN';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('column');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items by MS Column">Items by MS Column</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by STACKEDCOLUMN type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[8];
				},
				getTitle: function () {
					return 'Items in Stacked Column';
				},
				getType: function () {
					return 'STACKEDCOLUMN';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('column');
			expect(scope.chartConfig.options.plotOptions.column.stacking).to.equal('normal');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items in Stacked Column">Items in Stacked Column</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('should initialize scope.chartData as array objects and scope.chartConfig as an object when called by STACKEDAREA type charts', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[9];
				},
				getTitle: function () {
					return 'Items in Stacked Area';
				},
				getType: function () {
					return 'STACKEDAREA';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.equal(4);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('area');
			expect(scope.chartConfig.options.plotOptions.area.stacking).to.equal('normal');
			expect(scope.chartConfig.title.text).to.equal('<span title="Items in Stacked Area">Items in Stacked Area</span>');
			expect(scope.chartConfig.options.xAxis.labels.rotation).to.equal(-30);
		});

		it('displays the chart in the modal without the title and enlarge button', function () {
			/**
			 * Initialize the controller with our parameters of dependencies
			 */
			scope.reportObj = {
				getFullList: function () {
					return chartData[0];
				},
				getTitle: function () {
					return 'Items by Pie';
				},
				getType: function () {
					return 'PIE';
				}
			};
			var ctrl = $controllerConstructor('ReportChartController', {
				$scope: scope,
				LocalizationService: mockLocalizationService,
				_: underscore,
				$window: sinon.stub({
					bind: function () {
					}
				})
			});

			var locD = q.defer();
			timeout(function () {
				scope.bundle = {
					chart: {noDataToShow: 'No Data'}
				};
				locD.resolve();
			}, 500);
			mockLocalizationService.init.returns(locD.promise);
			mockLocalizationService.translate.returns('No Data');

			scope.isModal = 'true';
			ctrl.init();
			timeout.flush();

			expect(scope.chartData).to.have.length(1);
			expect(scope.chartData[0].data[0]).to.have.property('name');
			expect(scope.chartData[0].data[0].name).to.equal('pie chart name 1');
			expect(scope.chartData[0].data[0]).to.have.property('y');
			expect(scope.chartData[0].data[0].y).to.equal(100);
			expect(scope.chartConfig).to.have.property('noData');
			expect(scope.chartConfig).to.have.property('options');
			expect(scope.chartConfig).to.have.property('series');
			expect(scope.chartConfig.options.chart.type).to.equal('pie');
			expect(scope.chartConfig.title.text).to.equal(null);
		});
	});
});
