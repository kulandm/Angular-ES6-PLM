'use strict';

describe('WorkflowTransitionController', function () {
	var $controller, $rootScope, $scope, $q;
	var EventService, NotificationService, NotificationTypes;
	var mockModelsManager, mockItemObj, mockTransitionData;
	var flyoutInstance, flyoutClosed;
	var controller;
	var location;

	beforeEach(module(
		'com/autodesk/components/itemHeader/itemHeader.js',
		'plm360',
		'plm360.mockData',
		'plm360.mockObjects'
	));
	beforeEach(module('com/autodesk/components/itemHeader/itemHeader.js', 'plm360', 'plm360.mockData', 'plm360.mockObjects'));

	beforeEach(function () {
		flyoutClosed = false;

		flyoutInstance = {
			cancel: function () {
				flyoutClosed = true;
			},
			close: function () {
				flyoutClosed = true;
			}
		};

		location = sinon.stub({
			search: function () {}
		});

		inject(function (
			$httpBackend,
			_$controller_,
			_$rootScope_,
			_$q_,
			_EventService_,
			_NotificationService_,
			_NotificationTypes_,
			MockItemObj,
			MockModelsManager,
			MockTransitionData,
			MockLocalizationData
		) {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$scope = _$rootScope_.$new();
			$q = _$q_;
			EventService = _EventService_;
			NotificationService = _NotificationService_;
			NotificationTypes = _NotificationTypes_;

			mockItemObj = new MockItemObj();
			mockModelsManager = new MockModelsManager();
			mockTransitionData = MockTransitionData;

			$httpBackend.when('GET', 'translations/localizationBundleGeneral.json')
				.respond(MockLocalizationData);

			location.search.returns({itemId: 'test id'});
			$rootScope.bundle = MockLocalizationData;
			$scope.transition = {};
			$scope.workflowActionForm = {
				$valid: true,
				comments: {
					$invalid: false,
					$error: {
						required: false
					}
				}
			};
		});

		controller = $controller('WorkflowTransitionController', {
			$rootScope: $rootScope,
			$scope: $scope,
			$location: location,
			$flyoutInstance: flyoutInstance,
			EventService: EventService,
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes,
			ItemObj: mockItemObj,
			ModelsManager: mockModelsManager,
			AnchorElWidth: 300,
			MaxCommentsLength: 2000,
			ParentController: {
				proceedTransition: function () {
					flyoutClosed = true;
					return $q.when();
				},
				cancelTransition: function () {
					flyoutClosed = true;
				}
			}
		});
	});

	afterEach(function () {
		$scope.transition = null;
		$scope.workflowActionForm = null;
	});

	it('should cancel the transition', () => {
		expect(flyoutClosed).to.be.false;
		$scope.cancelTransition();
		expect(flyoutClosed).to.be.true;
	});

	it('should proceed the transition', () => {
		expect(flyoutClosed).to.be.false;
		$scope.proceedTransition();
		expect(flyoutClosed).to.be.true;
	});

	it('checks the transitions', () => {
		EventService.send('itemTransitions:test id:done', mockTransitionData);
		expect($scope.workflowTransitions.length).to.equal(2);
	});

	it('checks the transitions values', () => {
		EventService.send('itemTransitions:test id:done', mockTransitionData);
		expect($scope.workflowTransitions[0].customLabel)
			.to.equal('SUBMIT_FOR_REVIEW__');
	});

	it('sets \'hasDelegators\' to true if there are delegators', () => {
		EventService.send('itemTransitions:test id:done', mockTransitionData);
		expect($scope.hasDelegators).to.be.true;
	});

	it('checks for the setChosenActAsUser', () => {
		$scope.setChosenActAsUser('PLMAutotest');
		expect($scope.selectedUserImpersonation).to.equal('PLMAutotest');
	});

	it('returns true when required comments have not been filled in', () => {
		$scope.transition.comments = 'REQUIRED';
		$scope.comments = '';

		expect($scope.isCommentsRequiredAndInvalid()).to.be.true;
	});

	it('returns false when required comments have been filled in', () => {
		$scope.transition.comments = 'REQUIRED';
		$scope.comments = 'Test comments';

		expect($scope.isCommentsRequiredAndInvalid()).to.be.false;
	});

	describe('[Notifications]', () => {
		it('adds a comments-required notification', () => {
			sinon.stub(NotificationService, 'addNotification');
			$scope.workflowActionForm.comments.$invalid = true;
			$scope.workflowActionForm.comments.$error.required = true;

			$scope.proceedTransition();

			expect(NotificationService.addNotification).to.be.calledWith(
				'error',
				'Comments are required.'
			);
		});

		it('shows notifications after proceeding with the transition', () => {
			sinon.stub(NotificationService, 'showNotifications');

			$scope.proceedTransition();
			$scope.$digest();

			expect(NotificationService.showNotifications).to.be.calledOnce;
		});

		it('shows notifications on flyout when transition fails', () => {
			sinon.stub(NotificationService, 'showNotifications');
			$scope.workflowActionForm.$valid = false;

			$scope.proceedTransition();
			$scope.$digest();

			expect(NotificationService.showNotifications.callsArg(0)).to.be.defined;
		});
	});
});
