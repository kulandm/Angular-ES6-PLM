'use strict';

/**
 * @ngdoc directive
 * @name Directives.OnFilesSelected
 * @restrict A
 *
 * @description This directive is used to detect when files are selected from
 * the Windows File Dialog.
 *
 * This directive is placed in an input tag to avoid using:
 * <pre>onchange="angular.element(this).scope().triggerDialog()"</pre>
 * Because ng-change/ng-model doesn't work well with input[type=file].
 */
class OnFilesSelectedDirective {
	/*
	 * @ngdoc method
	 * @name Directives.OnFilesSelected#constructor
	 * @methodOf Directives.OnFilesSelected
	 * @description The class constructor.
	 */
	constructor() {
		this.restrict = 'A';
		this.scope = {
			onFilesSelected: '&'
		};
	}

	/**
	 * @ngdoc method
	 * @name Directives.OnFilesSelected#link
	 * @methodOf Directives.OnFilesSelected
	 * @description The link function
	 *
	 * @param {Object} scope Directive's scope
	 * @param {Object} element Directive's element
	 */
	link(scope, element) {
		element.bind('change', () => {
			scope.onFilesSelected({
				selectedFileList: element[0].files
			});

			// Reset the <input type="file"> FileList
			element[0].value = '';
		});
	}

	static directiveFactory() {
		OnFilesSelectedDirective.instance = new OnFilesSelectedDirective();
		return OnFilesSelectedDirective.instance;
	}
}

export default OnFilesSelectedDirective;
