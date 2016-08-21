(() => {
    'use strict';

    describe('VignettesModalController', () => {

        let controller, rootScope, sce, mdDialog;
        let modalCtrl;

        beforeEach(() => {
            module('com/autodesk/components/plmNavigation/plmNavigation.js');
            module({
                $mdDialog: {
                    hide: sinon.stub()
                }
            });
        });

        beforeEach(() => {
            inject((_$controller_, _$rootScope_, _$sce_, _$mdDialog_) => {
                controller = _$controller_;
                rootScope = _$rootScope_;
                sce = _$sce_;
                mdDialog = _$mdDialog_;
            });

            modalCtrl = controller('VignettesModalController', {
                $rootScope: rootScope,
                $scope: rootScope.$new(),
                $sce: sce,
                $mdDialog: mdDialog
            });
        });

        describe('[METHOD] closeVignettseModal', () => {
            it('Should close an currenly open modal', () => {
                modalCtrl.closeVignetteseModal();
                expect(modalCtrl.$mdDialog.hide).to.be.calledOnce;
            });
        });

        describe('[METHOD] getContentLink', () => {
            it('Should return a trustedValueObject for vignettes content link', () => {
                let expectedLik = '/link.html';
                rootScope.bundle = {
                    mainMenu: {
                        helpMenu: {
                            vignettes: {
                                link: expectedLik
                            }
                        }
                    }
                };

                let trustedValueObject = modalCtrl.getContentLink();

                expect(sce.getTrustedUrl(trustedValueObject)).to.equal(expectedLik);
            });
        });
    });
})();
