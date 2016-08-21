'use strict';

describe('[MODEL] ConfigurationListeners', () => {
	// Model Handle
	let ConfigurationsListeners, configurationListeners;
	let EventService, MockPromiseStubber, Configurations;

	beforeEach(module('com/autodesk/EventService.js', 'plm360.mockObjects', 'plm360.mockData'));

	beforeEach(() => {
		inject((_EventService_, _MockPromiseStubber_) => {
			EventService = _EventService_;
			MockPromiseStubber = _MockPromiseStubber_;

            Configurations = {
                fetch: sinon.stub()
            };
		});

        ConfigurationsListeners = System.get('com/autodesk/models/configurations/configurationsListeners.service.js').default;
        configurationListeners = new ConfigurationsListeners(EventService, Configurations);
	});

	afterEach(() => {
		EventService.unlisten(configurationListeners.getListener);
	});

	describe('[Initialization]', () => {
		it('Should have set a listener for get', () => {
			expect(configurationListeners.getListener).to.exist;
		});
	});

	describe('[STATE]', () => {
		it('Should respond to Configurations get messages and call the response function with the correct arguments', () => {
            let responseStub = sinon.stub(configurationListeners, 'respondToGetListener');
            let event = 'configurations:tenant:get';
            let link = 'someLink';
            let params = {};

            expect(responseStub.called).to.be.false;
			EventService.send(event, link, params);
			expect(responseStub.calledOnce).to.be.true;
            expect(responseStub.calledWith(event, link, params)).to.be.true;

			responseStub.restore();
		});
	});

	describe('[METHOD] respondToGetListener', () => {
		it('Should send a done message with data corresponding to the provided parameters', () => {
            let event = 'configurations:tenant:get';
            let link = 'someLink';
            let params = {};
            let response = {};

            MockPromiseStubber.setPromiseStubSuccess(Configurations.fetch, response, [link, params]);
			let sendSpy = sinon.spy(EventService, 'send');

            expect(sendSpy.called).to.be.false;
			configurationListeners.respondToGetListener(event, link, params);
            expect(sendSpy.calledOnce).to.be.true;
			expect(sendSpy.calledWith('configurations:tenant:done', response)).to.be.true;

			sendSpy.restore();
		});
	});
});
