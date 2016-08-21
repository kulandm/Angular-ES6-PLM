'use strict';

describe('[MODEL] BomConfigurationStateMachine', () => {
    let BomConfigurationStateMachine, stateMachine;

    let expectedState;

    let initialDate = '1999-12-25';

    let initMachineToExpectedState = () => {
        stateMachine.itemId = expectedState.itemId;
        stateMachine.viewDefId = expectedState.viewDefId;
        stateMachine.effectiveDate = moment(expectedState.effectiveDate, 'YYYY-MM-DD');
        stateMachine.revisionBias = expectedState.revisionBias;
        stateMachine.isWorkingRevision = expectedState.isWorkingRevision;
        stateMachine.state = expectedState.state;
    };

    let testIfMachineIsInExpectedState = () => {
        expect(stateMachine.itemId, 'itemId').to.equal(expectedState.itemId);
        expect(stateMachine.viewDefId, 'viewDefId').to.equal(expectedState.viewDefId);
        expect(stateMachine.effectiveDate.isSame(moment(expectedState.effectiveDate, 'YYYY-MM-DD')), 'effectiveDate').to.be.true;
        expect(stateMachine.revisionBias, 'revisionBias').to.equal(expectedState.revisionBias);
        expect(stateMachine.isWorkingRevision, 'isWorkingRevision').to.equal(expectedState.isWorkingRevision);
        expect(stateMachine.state).to.equal(expectedState.state);
    };

    beforeEach(module('plm360.mockObjects', 'plm360.mockData'));

    beforeEach(() => {
        BomConfigurationStateMachine = System.get('com/autodesk/models/bomGraph/bomConfigurationStateMachine.model.js').default;
        stateMachine = new BomConfigurationStateMachine('YYYY-MM-DD');

        // Set an arbitrary initial for the machine
        expectedState = {
            state: stateMachine.States.Refresh,
            viewDefId: '5',
            itemId: '9999',
            effectiveDate: initialDate,
            revisionBias: 'allChangeOrder',
            isWorkingRevision: false
        };

        initMachineToExpectedState();
    });

    describe('[METHOD] setState', () => {
        it('Should set the state', () => {
            expectedState.state = stateMachine.States.RevisionSet;

            stateMachine.setState(stateMachine.States.RevisionSet);

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] setViewDefId', () => {
        it('Should set the viewDefId', () => {
            expectedState.viewDefId = '3';

            stateMachine.setViewDefId('3');

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] setEffectiveDate', () => {
        it('Should set the effective date as the correct moment object', () => {
            expectedState.effectiveDate ='2016-01-20';

            stateMachine.setEffectiveDate('2016-01-20');

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] getEffectiveDate', () => {
        it('Should return nothing if the date is not yet set', () => {
            stateMachine.effectiveDate = null;
            expect(stateMachine.getEffectiveDate()).to.be.undefined;
        });

        it('Should return the date as a string if it is set', () => {
            stateMachine.setEffectiveDate('2016-01-20');
            expect(stateMachine.getEffectiveDate()).to.equal('2016-01-20');
        });
    });

    describe('[METHOD] setItemId', () => {
        it('Should set the itemId', () => {
            expectedState.itemId = '1234';

            stateMachine.setItemId('1234');

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] getRevisionBias', () => {
        it('Should get the revision bias', () => {
            stateMachine.setRevisionBias('working');
            expect(stateMachine.getRevisionBias()).to.equal('working');
        });
    });

    describe('[METHOD] setRevisionBias', () => {
        it('Should set the revision bias', () => {
            expectedState.revisionBias = 'working';

            stateMachine.setRevisionBias('working');

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] setIsWorkingRevision', () => {
        it('Should set the working revision flag', () => {
            expectedState.isWorkingRevision = true;

            stateMachine.setIsWorkingRevision(true);

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] setInitialState', () => {
        it('Should set the state and properties correctly', () => {
            expectedState.itemId = '1234';
            expectedState.viewDefId = '1';
            expectedState.revisionBias = 'release';
            expectedState.isWorkingRevision = true;
            expectedState.state = stateMachine.States.RevisionSet;

            stateMachine.setInitialState(expectedState.itemId, expectedState.viewDefId, expectedState.isWorkingRevision);

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] viewChanged', () => {
        it('Shoud set the state correctly', () => {
            expectedState.viewDefId = '1';
            expectedState.state = stateMachine.States.ViewDefChange;

            stateMachine.viewChanged('1');

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] configurationChanged', () => {
        it('Shoud delegate to dateChanged if the date changed', () => {
            let newDate = '2016-01-25';
            let newBias = 'changeOrder';

            let dateChangedStub = sinon.stub(stateMachine, 'dateChanged');
            dateChangedStub.withArgs(newDate);

            stateMachine.configurationChanged(newDate, newBias);

            expect(dateChangedStub.withArgs(newDate).calledOnce).to.be.true;
            dateChangedStub.restore();
        });

        it('Shoud delegate to biasChanged if the date has not changed', () => {
            let newDate = expectedState.effectiveDate;
            let newBias = 'changeOrder';

            let biasChangedStub = sinon.stub(stateMachine, 'biasChanged');

            stateMachine.configurationChanged(newDate, newBias);

            expect(biasChangedStub.calledOnce && biasChangedStub.calledWith(newBias)).to.be.true;
            biasChangedStub.restore();
        });
    });

    describe('[METHOD] dateChanged', () => {
        it('Should set the correct state if the item is in working revision and the date is moved forward', () => {
            let newDate = '2016-01-25';
            stateMachine.isWorkingRevision = true;
            expectedState.isWorkingRevision = true;

            expectedState.effectiveDate = newDate;
            expectedState.state = stateMachine.States.WorkingForwardDateChange;

            stateMachine.dateChanged(newDate);

            testIfMachineIsInExpectedState();
        });

        it('Should set the correct state if the item is in working revision and the date is moved backwards', () => {
            let newDate = '1995-01-25';
            stateMachine.isWorkingRevision = true;
            expectedState.isWorkingRevision = true;

            expectedState.effectiveDate = newDate;
            expectedState.state = stateMachine.States.DateChange;

            stateMachine.dateChanged(newDate);

            testIfMachineIsInExpectedState();
        });

        it('Should set the correct state if the item is not in working revision and the date is moved forward', () => {
            let newDate = '2016-01-25';
            stateMachine.isWorkingRevision = false;
            expectedState.isWorkingRevision = false;

            expectedState.effectiveDate = newDate;
            expectedState.state = stateMachine.States.DateChange;

            stateMachine.dateChanged(newDate);

            testIfMachineIsInExpectedState();
        });

        it('Should set the correct state if the item is not in working revision and the date is moved backwards', () => {
            let newDate = '1995-01-25';
            stateMachine.isWorkingRevision = false;
            expectedState.isWorkingRevision = false;

            expectedState.effectiveDate = newDate;
            expectedState.state = stateMachine.States.DateChange;

            stateMachine.dateChanged(newDate);

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] biasChanged', () => {
        it('Should set the correct state', () => {
            let newBias = 'release';

            expectedState.state = stateMachine.States.BiasChange;
            expectedState.revisionBias = newBias;

            stateMachine.biasChanged(newBias);

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] shouldRefresh', () => {
        it('Should set the correct state', () => {
            expectedState.state = stateMachine.States.Refresh;

            stateMachine.shouldRefresh();

            testIfMachineIsInExpectedState();
        });
    });

    describe('[METHOD] getFullConfiguration', () => {
        it('Should return the full bom configuration', () => {
            let result = stateMachine.getFullConfiguration();

            expect(result.viewDefId, 'viewDefId').to.equal(expectedState.viewDefId);
            expect(result.effectiveDate, 'effectiveDate').to.equal(expectedState.effectiveDate);
            expect(result.revisionBias, 'revisionBias').to.equal(expectedState.revisionBias);
        });
    });

    describe('[METHOD] getTopLineQueryParams', () => {
        it('Should return the correct payload for RevisionSet', () => {
            let newId = '2773';
            let viewDefId = '2';
            let isWorkingRevision = false;

            stateMachine.setInitialState(newId, viewDefId, isWorkingRevision);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: viewDefId,
                rootId: newId,
                revisionBias: 'release'
            }));
        });

        it('Should return the correct payload for WorkingForwardDateChange', () => {
            stateMachine.isWorkingRevision = true;

            let newDate = '2016-01-25';
            let newBias = 'changeOrder';

            stateMachine.configurationChanged(newDate, newBias);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                rootId: stateMachine.itemId,
                effectiveDate: newDate,
                revisionBias: 'release'
            }));
        });

        it('Should return the correct payload for DateChange', () => {
            stateMachine.isWorkingRevision = true;
            let newDate = '2016-01-25';
            let newBias = 'changeOrder';

            stateMachine.configurationChanged(newDate, newBias);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                effectiveDate: newDate,
                revisionBias: 'release'
            }));
        });

        it('Should return the correct payload for BiasChange when not in working', () => {
            stateMachine.isWorkingRevision = false;
            let newDate = '2016-01-25';
            let newBias = 'changeOrder';

            stateMachine.setEffectiveDate(newDate);
            stateMachine.configurationChanged(newDate, newBias);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: 'changeOrder'
            }));
        });

        it('Should return the correct payload for BiasChange when in working revision', () => {
            stateMachine.isWorkingRevision = true;
            let newDate = '2016-01-25';
            let newBias = 'changeOrder';

            stateMachine.setEffectiveDate(newDate);
            stateMachine.configurationChanged(newDate, newBias);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                rootId: stateMachine.itemId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: 'changeOrder'
            }));
        });

        it('Should return the correct payload for ViewDefChange when not in working revision', () => {
            stateMachine.isWorkingRevision = false;
            let viewDefId = '2';

            stateMachine.viewChanged(viewDefId);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: stateMachine.revisionBias
            }));
        });

        it('Should return the correct payload for ViewDefChange when in working revision', () => {
            stateMachine.isWorkingRevision = true;
            let viewDefId = '2';

            stateMachine.viewChanged(viewDefId);
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                rootId: stateMachine.itemId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: stateMachine.revisionBias
            }));
        });

        it('Should return the correct payload for Refresh when not in working revision', () => {
            stateMachine.isWorkingRevision = false;
            stateMachine.shouldRefresh();
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: stateMachine.revisionBias
            }));
        });

        it('Should return the correct payload for Refresh when in working revision', () => {
            stateMachine.isWorkingRevision = true;
            stateMachine.shouldRefresh();
            let result = stateMachine.getTopLineQueryParams();

            // Use a deep compare to check that payload doesn't contain unwanted parameters
            expect(_.isEqual(result, {
                viewDefId: stateMachine.viewDefId,
                rootId: stateMachine.itemId,
                effectiveDate: stateMachine.effectiveDate,
                revisionBias: stateMachine.revisionBias
            }));
        });
    });
});
