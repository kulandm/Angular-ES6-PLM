'use strict';

describe('FilteredPicklistFieldService', function () {

    let service;
    let eventService, modelsManager;
    let fpl1Data, fpl2Data, fpl3Data;

    beforeEach(function () {

        module('plm360.filteredPicklistService', 'plm360.mockData', 'plm360.mockObjects');

        eventService = sinon.stub({
            send: function () {},
            listen: function () {}
        });

        modelsManager = sinon.stub({
            getPicklistSelection: function () {},
            getPicklistOptions: function () {}
        });

        module(function ($provide) {
            $provide.value('EventService', eventService);
            $provide.value('ModelsManager', modelsManager);
        });

        inject(function (FilteredPicklistFieldService, MockFilteredPicklistFieldData) {
            service = FilteredPicklistFieldService;
            fpl1Data = MockFilteredPicklistFieldData[0];
            fpl2Data = MockFilteredPicklistFieldData[1];
            fpl3Data = MockFilteredPicklistFieldData[2];
        });
    });

    afterEach(function () {
        service = null;
        fpl1Data = null;
        fpl2Data = null;
        fpl3Data = null;
        modelsManager = null;
        eventService = null;
    });

    it('should have injected the service correctly', function () {
       expect(service).to.be.defined;
    });

    describe('[validateData]', function () {

        it('should have a validateData method', function () {
            expect(service.validateData).to.be.defined;
            expect(typeof service.validateData).to.equal('function');
        });

        it('should validate the provided data and return a true boolean value', function () {
            expect(service.validateData(fpl1Data)).to.be.true;
            expect(service.validateData(fpl2Data)).to.be.true;
            expect(service.validateData(fpl3Data)).to.be.true;
        });

        it('should NOT validate the provided data and return a false boolean value', function () {
            expect(service.validateData({})).to.be.false;
        });

    });

    describe('[extractIdFromLink]', function () {

        it('should have a extractIdFromLink method', function () {
            expect(service.extractIdFromLink).to.be.defined;
            expect(typeof service.extractIdFromLink).to.equal('function');
        });

        it('should extract correctly the id', function () {
            expect(service.extractIdFromLink(fpl1Data.link)).to.equal('FPL1');
            expect(service.extractIdFromLink(fpl2Data.link)).to.equal('FPL2');
            expect(service.extractIdFromLink(fpl3Data.link)).to.equal('FPL3');
        });

        it('should return null in those cases where the param is not correct', function () {
            expect(service.extractIdFromLink({})).to.be.null;
            expect(service.extractIdFromLink('something')).to.be.null;
            expect(service.extractIdFromLink(27)).to.be.null;
        });
    });

    describe('[getRegisteredPicklists]', function () {

        it('should have a getRegisteredPicklists method', function () {
            expect(service.getRegisteredPicklists).to.be.defined;
            expect(typeof service.getRegisteredPicklists).to.equal('function');
        });

        it('should return an empty object', function () {
            expect(service.getRegisteredPicklists().constructor).to.equal(Object);
            expect(service.getRegisteredPicklists()).to.be.empty;
        });
    });

    describe('[register]', function () {

        it('should have a register method', function () {
            expect(service.register).to.be.defined;
            expect(typeof service.register).to.equal('function');
        });

        it('should have registered the FPL1 picklist, but not FPL2 and FPL3', function () {

            service.register(fpl1Data);

            expect(service.getRegisteredPicklists()).to.have.property('/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.have.property('FPL1');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.not.have.property('FPL2');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.not.have.property('FPL3');
        });

        it('should have registered FPL2 and FPL3 related picklists, but not FPL1', function () {

            service.register(fpl2Data);
            service.register(fpl3Data);

            expect(service.getRegisteredPicklists()).to.have.property('/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.not.have.property('FPL1');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.have.property('FPL2');
            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'])
                .to.have.property('FPL3');
        });
    });

    describe('[buildRequestParams]', function () {

        it('should have a buildRequestParams method', function () {
            expect(service.buildRequestParams).to.be.defined;
            expect(typeof service.buildRequestParams).to.equal('function');
        });

		it('should build the params object only for FPL2 and FPL3, since FPL1 has value as null', function () {
			service.register(fpl1Data); // NO VALUE
			service.register(fpl2Data);
			service.register(fpl3Data);

			let params = service.buildRequestParams('/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS');

			expect(params).to.not.have.property('FPL1');
			expect(params).to.have.property('FPL2');
			expect(params).to.have.property('FPL3');

			expect(params.FPL2).to.equal('CO000011 - Test 1 - 3 - High');
			expect(params.FPL3).to.equal('Functional Fix');
		});

        it('should build the params object only for FPL1, FPL2 and FPL3', function () {

            let fpl1Copy = angular.copy(fpl1Data);
            fpl1Copy.value = 'A value';

            service.register(fpl1Copy);
            service.register(fpl2Data);
            service.register(fpl3Data);

            let params = service.buildRequestParams('/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS');

            expect(params).to.have.property('FPL1');
            expect(params).to.have.property('FPL2');
            expect(params).to.have.property('FPL3');

            expect(params.FPL1).to.equal('A value');
        });

        it('should return an empty params object when no values are provided', function () {

            let fpl1Copy = angular.copy(fpl1Data);
            let fpl2Copy = angular.copy(fpl2Data);
            let fpl3Copy = angular.copy(fpl3Data);

            fpl1Copy.value = null;
            fpl2Copy.value = null;
            fpl3Copy.value = null;

            service.register(fpl1Copy);
            service.register(fpl2Copy);
            service.register(fpl3Copy);

            expect(service.buildRequestParams('/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS')).to.be.empty;
        });

    });

    describe('[saveValue]', function () {

        it('should have a saveValue method', function () {
            expect(service.saveValue).to.be.defined;
            expect(typeof service.saveValue).to.equal('function');
        });

        it('should set a new value for FPL1', function () {

            const newVal = 'A new value';

            service.register(fpl1Data);
            service.saveValue(fpl1Data, newVal);

            expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL1.value)
                .to.equal(newVal);

        });

		it('should remove the value for FPL2 and FPL3', function () {
			const newVal = null;

			service.register(fpl2Data);
			service.register(fpl3Data);
			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL2.value.title).to.equal('CO000011 - Test 1 - 3 - High');
			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL3.value).to.equal('Functional Fix');

			service.saveValue(fpl2Data, newVal);
			service.saveValue(fpl3Data, newVal);

			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL2.value).to.be.null;
			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL3.value).to.be.null;
		});

		it('should fail nicely if no params are provided', function () {
			expect(service.saveValue()).to.equal(null);
		});

		it('should clean the value of the object if no value is provided', function () {
			service.register(fpl2Data);
			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL2.value).to.be.null;

			service.saveValue(fpl2Data);
			expect(service.getRegisteredPicklists()['/api/v3/picklists/CUSTOM_LOOKUP_WS_CHANGE_ORDERS'].FPL2.value).to.equal(undefined);
		});

	});

    describe('[notifyRelatedFpls]', function () {

        it('should have a notifyRelatedFpls method', function () {
            expect(service.notifyRelatedFpls).to.be.defined;
            expect(typeof service.notifyRelatedFpls).to.equal('function');
        });

        it('should fail nicely if no param is provided', function () {
            expect(service.notifyRelatedFpls()).to.be.null;
        });

        it('should call the models manager to get related picklists selections', function () {

            service.register(fpl1Data);
            service.register(fpl2Data);
            service.register(fpl3Data);

            service.notifyRelatedFpls(fpl1Data, 'Update my companions');

            expect(modelsManager.getPicklistSelection).to.have.been.called;
            expect(eventService.listen).to.have.been.called;
        });

    });

    describe('[getOptions]', function () {

        it('should have a getOptions method', function () {
            expect(service.getOptions).to.be.defined;
            expect(typeof service.getOptions).to.equal('function');
        });

        it('should fail nicely if no param is provided', function () {
            var options = service.getOptions();
			expect(options).to.eventually.be.rejected;
        });

        it('should call the models manager to get related picklists selections', function () {

            service.register(fpl1Data);
            service.getOptions(fpl1Data);

            expect(modelsManager.getPicklistOptions).to.have.been.called;
            expect(eventService.listen).to.have.been.called;
        });
    });
});
