'use strict';

describe('[MODEL] Configurations', () => {
    let Configurations, configurations;
    let MockPromiseStubber, mockRESTWrapperService;
    let mockConfigurations;

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        inject((_MockPromiseStubber_, MockConfigurations) => {
            mockConfigurations = MockConfigurations;
            MockPromiseStubber = _MockPromiseStubber_;
        });

        mockRESTWrapperService = {
            get: sinon.stub()
        };

        Configurations = System.get('com/autodesk/models/configurations/configurations.model.js').default(mockRESTWrapperService);
        configurations = new Configurations(mockConfigurations);
    });

    describe('[INIT]', () => {
        it('Should store the payload', () => {
            expect(configurations.json).to.equal(mockConfigurations);
        });

        it('Should store the provided configurations by key', () => {
            expect(configurations.configurationsMap.size).to.equal(mockConfigurations.length);
            expect(configurations.configurationsMap.get('someConfiguration')).to.equal(mockConfigurations[0]);
            expect(configurations.configurationsMap.get('someOtherConfiguration')).to.equal(mockConfigurations[1]);
            expect(configurations.configurationsMap.get('someUnprovidedConfiguration')).to.be.undefined;
        });
    });

    describe('[METHOD] getConfigKey', () => {
        it('Should extract the key', () => {
            let configObj = mockConfigurations[0];
            expect(configurations.getConfigKey(configObj)).to.equal('someConfiguration');
        });
    });

    describe('[METHOD] getConfig', () => {
        it('Should return the correct config', () => {
            expect(configurations.getConfig('someConfiguration')).to.equal(mockConfigurations[0]);
        });

        it('Should return undefined if the config is not found', () => {
            expect(configurations.getConfig('someUnprovidedConfiguration')).to.be.undefined;
        });
    });

    describe('[STATIC METHOD] fetch', () => {
        it('Should return an instance of Configurations corresponding to the link', () => {
			MockPromiseStubber.setPromiseStubSuccess(mockRESTWrapperService.get, mockConfigurations, ['someLink', sinon.match.any, sinon.match.any, sinon.match.any]);
			expect(Configurations.fetch('someLink', null)).to.deep.equal(configurations);
		});
    });
});
