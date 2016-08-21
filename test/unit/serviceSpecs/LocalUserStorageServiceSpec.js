'use strict';

describe('LocalUserStorageService', () => {
	let LocalUserStorageService, $rootScope, EventService;
	let mockWindow, mockModelsManager, mockUserObj;

	beforeEach(module('com/autodesk/EventService.js', 'com/autodesk/services/LocalUserStorage.service.js'));

	beforeEach(module(($provide) => {
		mockWindow = {
			localStorage: {
				setItem: sinon.stub(),
				getItem: sinon.stub(),
				removeItem: sinon.stub()
			}
		};
		$provide.value('$window', mockWindow);

		mockModelsManager = {
			getCurrentUser: sinon.stub()
		};
		$provide.value('ModelsManager', mockModelsManager);
	}));

	beforeEach(() => {
		inject((_$rootScope_, _LocalUserStorageService_, _EventService_) => {
			$rootScope = _$rootScope_;
			LocalUserStorageService = _LocalUserStorageService_;
			EventService = _EventService_;
		});

		mockUserObj = {
			getId: sinon.stub()
		};
		mockUserObj.getId.returns('someUserId');

		EventService.send('currentUser:currentUser:done', mockUserObj);
		$rootScope.$apply();
	});

	describe('[INIT]', () => {
		it('Should load the user', () => {
			expect(LocalUserStorageService.userKey).to.equal('$$USER_someUserId');
		});
	});

	describe('[METHOD] loadUser', () => {
		it('Should request the user be loaded', () => {
			mockModelsManager.getCurrentUser.reset();
			LocalUserStorageService.loadUser();
			expect(mockModelsManager.getCurrentUser.calledOnce).to.be.true;
			EventService.send('currentUser:currentUser:done', mockUserObj);
		});

		it('Should store the id of the user', () => {
			LocalUserStorageService.loadUser();
			mockUserObj.getId.returns('someOtherUserId');
			EventService.send('currentUser:currentUser:done', mockUserObj);
			expect(LocalUserStorageService.userKey).to.equal('$$USER_someOtherUserId');
		});
	});

	describe('[METHOD] canUseLocalStorage', () => {
		// Since method source is https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API,
		//	Assumption is that it works well enough - more tests can be added if need be
		it('Should return true if local storage is defined', () => {
			expect(LocalUserStorageService.canUseLocalStorage()).to.be.true;
		});

		it('Should return true if local storage is not defined', () => {
			mockWindow.localStorage = undefined;
			expect(LocalUserStorageService.canUseLocalStorage()).to.be.false;
		});
	});

	describe('[METHOD] getUserDataStorage', () => {
		it('Should create a new map and store it if it is not defined', () => {
			expect(mockWindow.localStorage.setItem.called).to.be.false;

			let data = LocalUserStorageService.getUserDataStorage();

			expect(data).to.deep.equal({});
			expect(mockWindow.localStorage.setItem.calledOnce).to.be.true;
			expect(mockWindow.localStorage.setItem.args[0][0]).to.equal(LocalUserStorageService.userKey);
			expect(mockWindow.localStorage.setItem.args[0][1]).to.equal(JSON.stringify(data));
		});

		it('Should return the stored object if it is available', () => {
			let data = {
				someKey: 'someValue'
			};
			mockWindow.localStorage.getItem.withArgs(LocalUserStorageService.userKey).returns(JSON.stringify(data));
			let returnedData = LocalUserStorageService.getUserDataStorage();
			expect(returnedData).to.deep.equal(data);
		});
	});

	describe('[METHOD] get', () => {
		it('Should return the value if it is available', () => {
			let userObj = {
				someKey: 'someValue'
			};
			mockWindow.localStorage.getItem.withArgs(LocalUserStorageService.userKey).returns(JSON.stringify(userObj));
			expect(LocalUserStorageService.get('someKey')).to.equal(userObj.someKey);
		});

		it('Should return undefined if the key is not present', () => {
			let userObj = {
				someKey: 'someValue'
			};
			mockWindow.localStorage.getItem.withArgs(LocalUserStorageService.userKey).returns(JSON.stringify(userObj));
			expect(LocalUserStorageService.get('someOtherKey')).to.equal(undefined);
		});
	});

	describe('[METHOD] set', () => {
		it('Should set the value to the user object and store it', () => {
			let userObj = {
				someKey: 'someValue'
			};
			mockWindow.localStorage.getItem.withArgs(LocalUserStorageService.userKey).returns(JSON.stringify(userObj));

			expect(mockWindow.localStorage.setItem.called).to.be.false;
			LocalUserStorageService.set('someOtherKey', 'someOtherValue');
			expect(mockWindow.localStorage.setItem.args[0][0]).to.equal(LocalUserStorageService.userKey);
			expect(mockWindow.localStorage.setItem.args[0][1]).to.equal(JSON.stringify({
				someKey: 'someValue',
				someOtherKey: 'someOtherValue'
			}));
		});
	});
});
