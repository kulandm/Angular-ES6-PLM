'use strict';

/**
 * @ngdoc object
 * @name Controllers.VignettesModalController
 *
 * @description This controller is associated with modal for showing vignettes help content.
 *
 * ##Dependencies
 *
 */

class VignettesModalController {
	/*
	 * @ngdoc method
	 * @name Controllers.VignettesModalController#constructor
	 * @methodOf Controllers.VignettesModalController
	 * @description The class constructor.
	 */
	constructor($rootScope, $scope, $sce, $mdDialog) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$sce = $sce;
		this.$mdDialog = $mdDialog;
	}

    /**
     * @ngdoc method
     * @name Controllers.VignettesModalController#closeVignetteseModal
     * @methodOf Controllers.VignettesModalController
     * @description Hide an currently opened dialog and resolves the promise
     * returned from `$mdDialog.show()`.
     *
     * @returns {Promise} A promise that is resolved when the dialog has been closed.
     */
    closeVignetteseModal() {
      this.$mdDialog.hide();
    }

    /**
     * @ngdoc method
     * @name Controllers.VignettesModalController#getContentLink
     * @methodOf Controllers.VignettesModalController
     * @description turns the external vignettes link into a 'TrustedValueHolderType'
	 * object in order to make it interpolatable.
     *
     * @returns {Object} a trusted value holder object.
     */
    getContentLink() {
        let vignettesLink = this.$rootScope.bundle.mainMenu.helpMenu.vignettes.link;
        let trustedValueObject = this.$sce.trustAsResourceUrl(vignettesLink);

        return trustedValueObject;
    }
}

export default VignettesModalController;
