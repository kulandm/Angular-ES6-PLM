/**
 * @ngdoc directive
 * @name Directives.ClassificationSection
 * @restrict E
 *
 * @description This directive is used to show classification name of a section
 * It expects the following attribute:
 * - partUrn: Urn of the classification
 *
 * ##Dependencies
 *
 * @example
 * <doc:example>
 *   <doc:source>
 * 		<classification-section part-urn="" mode="" ></classification-section>
 *   </doc:source>
 * </doc:example>
 */

const LOG = new WeakMap();
const UNDERSCORE = new WeakMap();
const CLASSIFICATION_SERVICE = new WeakMap();
const Q = new WeakMap();
const MODAL = new WeakMap();
const EVENT_SERVICE = new WeakMap();
const CLASSIFICATION_UTIL = new WeakMap();

class ClassificationSection {

	/**
	 * @ngdoc method
	 * @name Directives.ClassificationSection#constructor
	 * @methodOf Directives.ClassificationSection
	 * @description The class constructor
	 *
	 */
	constructor(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil) {
		this.replace = true;
		this.restrict = 'E';
		this.scope = {
			partUrn: '=',
			isEdition: '=',
			headerText: '='
		};
		this.templateUrl = 'classificationSection.html';
		this.transclude = false;

		CLASSIFICATION_SERVICE.set(this, ClassificationService);
		LOG.set(this, $log);
		UNDERSCORE.set(this, _);
		Q.set(this, $q);
		MODAL.set(this, $mdDialog);
		EVENT_SERVICE.set(this, EventService);
		CLASSIFICATION_UTIL.set(this, ClassificationUtil);

	}

	/**
	 * @ngdoc method
	 * @name Directives.ClassificationSection#link
	 * @methodOf Directives.ClassificationSection
	 * @description The directive's link function
	 *
	 */
	link(scope, element, attrs) {

		let ClassificationService = CLASSIFICATION_SERVICE.get(ClassificationSection.instance);
		let $q = Q.get(ClassificationSection.instance);
		let _ = UNDERSCORE.get(ClassificationSection.instance);
		let $mdDialog = MODAL.get(ClassificationSection.instance);
		let EventService = EVENT_SERVICE.get(ClassificationSection.instance);
		let ClassificationUtil = CLASSIFICATION_UTIL.get(ClassificationSection.instance);

		/**
		 * classificationName holder of the classificaiton name shown in the section header
		 * @type {String}
		 */
		scope.classificationName = null;

		/**
		 * classificationFullPath Title of the span, it shows the full path between upper classification and item classification
		 * @type {String}
		 */
		scope.classificationFullPath = '';

		let classificationConfig = {
			// holds the id of the classification associated with an item
			classificationId: null,
			// stores the initial node used
			initialClassificationNode: null,
			// stores the selected node
			selectedClassification: null,
			// The id of the workspace class used
			workspaceClassificationId: null
		};

		/**
		 * [isPhantomClass flag to show/hide warning icon]
		 * @type {Boolean}
		 */
		scope.isPhantomClass = false;

		/**
		 * Given a URN it retrieves its schema
		 * @param  {String} urn The urn of the resource
		 * @return {Defer}     Promise of the schema
		 */
		let getSchemaFromUrn = (urn) => {
			let deferred = $q.defer();
			let partsSchema = {};
			ClassificationService.getPartFromUrn(urn).then(response => {
				_.each(response, part => {
					partsSchema = _.extend(partsSchema, part.data);
				});
				deferred.resolve(partsSchema);
			}, error => {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		/**
		 * Given a urn, resolves the classificaiton Object associated
		 * @param  {String} urn THe classification urn
		 * @return {Object}     The result classification
		 */
		let getClassificationFromUrn = (urn) => {
			let deferred = $q.defer();
			ClassificationService.getPartFromUrn(urn).then(response => {
				if (angular.isDefined(response) && (response.length > 0) && angular.isDefined(response[0].classifications.link)) {
					ClassificationService.getPart(response[0].classifications.link).then(partResponse => {
						deferred.resolve((partResponse) ? partResponse.classifications[0] : null);
					}, error => {
						deferred.reject(error);
					});
				} else {
					deferred.resolve(null);
				}
			}, error => {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		/**
		 * Retrieve the schema (fields keys & values) of a classification given the part URN
		 * @param  {String} partUrn The part URN
		 * @return {Object}         {schemas: {item:Object, workspace: Object}, classifications: {item:Object, workspace: Object}}
		 */
		let retrieveSchema = (partUrn) => {
			let deferred = $q.defer();
			let parameters = ClassificationUtil.getUniformedParametersFromUrn(partUrn);

			let schemas = {item: null, workspace: null};
			let classifications = {item: null, workspace: null};

			if (partUrn.indexOf('item') > -1) {
				// this is a part of an item
				schemas.item = getSchemaFromUrn('urn:adsk.plm:tenant.workspace.item:' + parameters.tenant + '/' + parameters.workspace + '/' + parameters.item);
				classifications.item = getClassificationFromUrn('urn:adsk.plm:tenant.workspace.item:' + parameters.tenant + '/' + parameters.workspace + '/' + parameters.item);
			}
			if (partUrn.indexOf('workspace') > -1) {
				// this is a part of a workspace
				schemas.workspace = getSchemaFromUrn('urn:adsk.plm:tenant.workspace:' + parameters.tenant + '/' + parameters.workspace);
				classifications.workspace = getClassificationFromUrn('urn:adsk.plm:tenant.workspace:' + parameters.tenant + '/' + parameters.workspace);
			} else if (partUrn.indexOf('tenant') > -1) {
				// this is a part of a tenant
				// It should never end here, don't pull anything
				console.error('No tenant provided');
				deferred.reject(null);
			}

			$q.all([schemas.item, schemas.workspace, classifications.item, classifications.workspace]).then(response => {
				deferred.resolve({
					schemas: {
						item: (response[0]) ? response[0] : null,
						workspace: (response[1]) ? response[1] : null
					},
					classifications: {
						item: (response[2]) ? response[2] : null,
						workspace: (response[3]) ? response[3] : null
					}
				});
			});

			return deferred.promise;
		};

		/**
		 * It retrieves the full path (class name) between upper node (root classification from workspace) and item node (item classification)
		 * @param  {Number} from Upper classification
		 * @param  {Number} to   Lower classification
		 * @return {String}      The full/path/between/nodes
		 */
		let classificationFullPath = (from, to) => {
			let deferred = $q.defer();
			let result = '';

			ClassificationService.getFullPath(from, to).then(arrayPath => {
				deferred.resolve(_.map(arrayPath, _.iteratee('displayName')).join('/'));
			}, error => {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		/**
		 * Define a batch of commands to run on init of the directive
		 * @return {Void} Nothing to return
		 */
		let init = () => {
			retrieveSchema(scope.partUrn).then(schemas => {
				scope.classificationFullPath = schemas.classifications.workspace.displayName;
				// Item class id
				classificationConfig.classificationId = (schemas.classifications.item && schemas.classifications.item.id) || schemas.classifications.workspace.id;
				classificationConfig.selectedClassification = schemas.classifications.workspace.id;

				if (schemas.classifications.item) {
					classificationConfig.initialClassificationNode = schemas.classifications.item;

					classificationFullPath(schemas.classifications.workspace.id, schemas.classifications.item.id).then(fullPath => {
						scope.classificationFullPath = fullPath + '/';
					}, error => {
						scope.classificationFullPath = '';
					});
				} else {
					classificationConfig.initialClassificationNode = schemas.classifications.workspace;
					scope.classificationFullPath = scope.classificationFullPath;
				}

				scope.classificationName = classificationConfig.initialClassificationNode.displayName;
				/*eslint-disable */
				scope.isPhantomClass = classificationConfig.initialClassificationNode.ext['abstract'] || false;
				/*eslint-disable */
			});
		};

		/**
		 * Add to view the ability to determine if i'm on edit mode or not, so we can show class name as hyperlink
		 * @return {Boolean} True iff on edit mode
		 */
		scope.isEditionMode = () => {
			return (scope.isEdition) ? true : false;
		};

		/**
		* @ngdoc method
		* @name Directives.ClassificationSection#verifyForChangedClassification
		* @methodOf Directives.ClassificationSection
		* @description If we cancel edition/creation we go back the the old classification name and update the path
		*/
		scope.verifyForChangedClassification = () => {
			if (!scope.isEditionMode() && classificationConfig.selectedClassification) {
				classificationConfig.selectedClassification = classificationConfig.initialClassificationNode;
				scope.classificationName = classificationConfig.initialClassificationNode.displayName;
				updateClassificationFullPath();
				classificationConfig.classificationId = classificationConfig.selectedClassification.id;
			}
		};

		/* @ngdoc method
		* @name Directives.ClassificationSection#updateClassificationFullPath
		* @methodOf Directives.ClassificationSection
		* @description When the user changes the classification from the iframe, we update the full path of the classification
		*/
		let updateClassificationFullPath = () => {
			if (classificationConfig.selectedClassification && classificationConfig.selectedClassification) {
				scope.classificationFullPath = classificationConfig.selectedClassification.displayName + '/';
				classificationFullPath(classificationConfig.initialClassificationNode.id, classificationConfig.selectedClassification.id).then(fullPath => {
					scope.classificationFullPath = fullPath + '/';
				});
			}
		};

		let reClassify = (node) => {
			scope.classificationName = node.label;
			scope.isPhantomClass = node.data.ext['abstract'] || false;
		};

		scope.openCwsModal = () => {
			let that = this;
			let listener = (data) => {
				if (data.detail === null) {
					$mdDialog.hide();
				} else {
					classificationConfig.selectedClassification = data.detail;
					classificationConfig.classificationId = data.detail.data.id;

					updateClassificationFullPath();

					reClassify(data.detail);
					$mdDialog.hide();
					EventService.send('classification:update', [{selected: data.detail}]);
				}
			};

			$mdDialog.show({
				clickOutsideToClose: true,
				escapeToClose: true,
				templateUrl: 'cwsIframeTemplate.html',
				controller: ($scope, $mdDialog) => {
					let params = ClassificationUtil.getUniformedParametersFromUrn(scope.partUrn);
					let urn = encodeURIComponent('urn:adsk.plm:tenant.workspace:' + params.tenant + '\\' + params.workspace + '/selectedURN/' + classificationConfig.classificationId);
					$scope.customerUrn = '/cws-admin/index.html#/reClassify/rootURN/' + urn;

					// Add listener
					window.addEventListener('TREE_VIEW_OK', listener);
				},
				onComplete: () => {
				}
			}).finally(() => {
				// remove listener right away closing the modal
				window.removeEventListener('TREE_VIEW_OK', listener, false);
			});

		};

		// Only if this is a classification section
		if (angular.isDefined(scope.partUrn) && scope.partUrn !== undefined) {
			init();
		}
	}

	/**
	 * @ngdoc method
	 * @name Directives.ClassificationSection#directiveFactory
	 * @methodOf Directives.ClassificationSection
	 * @description The directive factory
	 *
	 */
	static directiveFactory(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil) {
		ClassificationSection.instance = new ClassificationSection(ClassificationService, $q, $log, _, $mdDialog, EventService, ClassificationUtil);
		return ClassificationSection.instance;
	}
}

ClassificationSection.directiveFactory.$inject = ['ClassificationService', '$q', '$log', '_', '$mdDialog', 'EventService', 'ClassificationUtil'];

export default ClassificationSection;
