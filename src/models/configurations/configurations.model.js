/**
 * @ngdoc object
 * @name Models.Configurations
 * @description A Model for the configurations stored at api/v3/configurations
 */
class Configurations {
    /**
     * @ngdoc method
     * @name Models.Configurations#constructor
     * @methodOf Models.Configurations
     * @description Parses the json and stores it in a map
     */
    constructor(json) {
        /**
         * @ngdoc property
         * @name Models.Configurations#constructor
         * @propertyOf Models.Configurations
         * @description A map of configuration keys to configuration objects
         */
        this.configurationsMap = new Map();

        if (json) {
            json.forEach((config) => {
                this.configurationsMap.set(this.getConfigKey(config), config);
            });
        }

        /**
         * @ngdoc property
         * @name Models.Configurations#json
         * @propertyOf Models.Configurations
         * @description The json used to build this object
         */
        this.json = json;
    }

    /**
     * @ngdoc method
     * @name Models.Configurations#getConfigKey
     * @methodOf Models.Configurations
     * @description Returns a key by which the config object can be accessed
     *  Specifically, '/api/v3/configurations/helpLocation' will return 'helpLocation'
     */
    getConfigKey(configObj) {
        return configObj.link.split('/').pop();
    }

    /**
     * @ngdoc method
     * @name Models.Configurations#getConfig
     * @methodOf Models.Configurations
     * @description Returns a config objected associated with the key,
     *      or undefined if there is no associated config
     * @param {String} key The key to lookup
     *
     * @returns {Object} the config object
     */
    getConfig(key) {
        return this.configurationsMap.get(key);
    }

    /**
     * @ngdoc method
     * @name Models.Configurations#fetch
     * @methodOf Models.Configurations
     * @description Fetches the configurations
     */
    static fetch(link, params) {
        return this.RESTWrapperService.get(link, null, params, null).then((payload) => {
			return new Configurations(payload);
		});
    }
}

let ConfigurationsFactory = (RESTWrapperService) => {
    Configurations.RESTWrapperService = RESTWrapperService;

    return Configurations;
};

ConfigurationsFactory.$inject = ['RESTWrapperService'];

export default ConfigurationsFactory;
