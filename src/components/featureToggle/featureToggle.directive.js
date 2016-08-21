
const MODELS_MANAGER = new WeakMap();
const EVENT_SERVICE = new WeakMap();

class FeatureToggle {

	constructor(ModelsManager, EventService) {

		this.restrict = 'A';
		this.scope = {
			featureToggle: '@'
		};

		MODELS_MANAGER.set(this, ModelsManager);
		EVENT_SERVICE.set(this, EventService);
	}

	link(scope, element) {

		// This is a fallback in the case the event is never triggered because of something.
		// When the event arrives and the code block that evaluates the response validate the feature
		// the visibility is restore to visible.
		element.css('visibility', 'hidden');

		let listenerId = EVENT_SERVICE.get(FeatureToggle.instance).listen('enabledFeatures:tenant:done', (event, obj) => {

			let enabled = false;
			let features = obj.getDisplayableData();

			if (features && features.data && scope.featureToggle) {
				angular.forEach(features.data, function (feature) {
					if (feature && feature.title && feature.title === scope.featureToggle) {
						enabled = true;
					}
				});
			}

			// Maybe in other scenarios with different features we might not want to remove the element.
			// At this moment, for item.update in Release 10.01 and in a hurry, we are removing it.
			// TODO: Revisit this
			if (!enabled) {
				element.remove();
			} else {
				element.css('visibility', 'visible');
			}

			EVENT_SERVICE.get(FeatureToggle.instance).unlisten(listenerId);
		});

		MODELS_MANAGER.get(FeatureToggle.instance).getEnabledFeatures();
	}

	static directiveFactory(ModelsManager, EventService) {
		FeatureToggle.instance = new FeatureToggle(ModelsManager, EventService);
		return FeatureToggle.instance;
	}
}

FeatureToggle.directiveFactory.$inject = ['ModelsManager', 'EventService'];

export default FeatureToggle;