'use strict';

describe('BomPinningDirective', () => {
    let $compile, $rootScope, scope, el, toggleStub;

    beforeEach(module('com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js', 'plmTemplates'));

    beforeEach(() => {
        inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;

            scope = $rootScope.$new();
        });

        scope.fieldData = {
            value: 'false'
        };
        scope.editView = 'false';

        toggleStub = sinon.stub();
        scope.onToggle = toggleStub;

        el = angular.element('<bom-pinning field-data="fieldData" edit-view="{{editView}}" on-toggle="onToggle()"></bom-pinning>');

        $compile(el)(scope);
		scope.$apply();
    });

    it('Binds the data', () => {
        let directiveScope = el.isolateScope();
        expect(directiveScope.fieldData.value).to.equal('false');

        directiveScope.onToggle();
        directiveScope.$digest();

        expect(toggleStub.calledOnce).to.be.true;
    });

    describe('[View mode]', () => {
        it('Should display the correct section when not in edit mode', () => {
            expect($('.editable-pin-section', el).length).to.equal(0);
            expect($('.uneditable-pin-section', el).length).to.equal(1);
        });

        it('Should not display the pinning icon if not editing and the element is not pinned', () => {
            expect($('.uneditable-pin-section .icon-a360-pin', el).length).to.equal(0);
        });

        it('Should display the pinning icon if not editing and the element is pinned', () => {
            scope.fieldData.value = 'true';
            scope.$apply();

            expect($('.uneditable-pin-section .icon-a360-pin', el).length).to.equal(1);
        });
    });

    describe('[Edit mode]', () => {
        beforeEach(() => {
            scope.editView = 'true';
            scope.$apply();
        });

        it('Should display the correct section when in edit mode', () => {
            expect($('.editable-pin-section', el).length).to.equal(1);
            expect($('.uneditable-pin-section', el).length).to.equal(0);
        });

        it('The pinning icon should exist but not be styled correctly if editing and the element is not pinned', () => {
            expect($('.editable-pin-section .icon-a360-pin', el).length).to.equal(1);
            expect($('.editable-pin-section.unpinned-editable-pin-section', el).length).to.equal(1);
        });

        it('The pinning icon should exist and be visible if editing and the element is pinned', () => {
            scope.fieldData.value = 'true';
            scope.$apply();

            expect($('.editable-pin-section .icon-a360-pin', el).length).to.equal(1);
            expect($('.editable-pin-section.unpinned-editable-pin-section', el).length).to.equal(0);
        });

        it('Should toggle the value and call onToggle when calling the internal toggle method', () => {
            let directiveScope = el.isolateScope();
            expect(directiveScope.fieldData.value).to.equal('false');

            directiveScope.internalOnToggle();
            directiveScope.$digest();

            expect(directiveScope.fieldData.value).to.equal('true');
            expect(toggleStub.calledOnce).to.be.true;
        });
    });
});
