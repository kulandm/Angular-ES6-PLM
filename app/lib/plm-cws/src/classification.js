import RESTWrapperService from 'com/autodesk/RESTWrapperService.js';
import EventService from 'com/autodesk/EventService.js';
import UnderscoreService from 'com/autodesk/UnderscoreService.js';
import ClassificationUtil from 'com/autodesk/classification.util.js';
import ClassificationService from 'com/autodesk/classification.service.js';
import ClassificationSection from 'com/autodesk/classificationSection.directive.js';
import FieldSelectorFactory from 'com/autodesk/FieldSelectorFactory.js';

angular.module(__moduleName, [
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'com/autodesk/RESTWrapperService.js',
    'com/autodesk/EventService.js',
    'com/autodesk/UnderscoreService.js',
    'com/autodesk/FieldSelectorFactory.js'
])
.service('ClassificationUtil', [
    'CLASSIFICATION_FIELD_TYPES', 
    'FieldSelectorFactory', 
    'DATA_SOURCE_TYPES',
    '$rootScope',
    (CLASSIFICATION_FIELD_TYPES, DATA_SOURCE_TYPES, FieldSelectorFactory, $rootScope) => new ClassificationUtil(CLASSIFICATION_FIELD_TYPES, FieldSelectorFactory, DATA_SOURCE_TYPES, $rootScope)])
.factory('ClassificationService', [
	'RESTWrapperService',
	'ClassificationUtil',
	'$q',
    'CLASSIFICATION_FIELD_TYPES',
    'PAGE_SIZE',
    'API_V2_PREFIX',
	(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX) => new ClassificationService(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX)
])
.constant('SECTION_TYPES', {FIELD_CONTAINER: 'FIELDCONTAINER', CLASSIFICATION: 'CLASSIFICATION'})
.constant('CLASSIFICATION_FIELD_TYPES', {TEXT: 'text', NUMBER: 'number', PICKLIST: 'picklist'})
.constant('DATA_SOURCE_TYPES', {cws: 'CWS', plm: 'PLM'})
.constant('PAGE_SIZE', 100)
.constant('API_V2_PREFIX', 'api/v2/')
.directive('classificationSection', ClassificationSection.directiveFactory);