import UnderscoreService from 'com/autodesk/UnderscoreService.js';
import SectionWrapperDirective from './sectionWrapper.directive.js';

angular.module(__moduleName, [
    'com/autodesk/UnderscoreService.js'
])
.directive('sectionWrapper', SectionWrapperDirective.directiveFactory);
