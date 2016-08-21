//(() => {
	'use strict';

	/**
	 * MockPromiseStubber
	 *	A class whose static methods can be used to stub promises with a following
	 *		.then call without using $q *
	 *	Rationale:
	 *
	 *	Typically, one would use $q.defer(), then set the returns value of the promise stub to be the promise of the deferredObject,
	 *		then resolve the deferred object
	 *	However, if $q.defer() is used, it may require a $rootScope.apply() to resolve the promise (see https://docs.angularjs.org/api/ng/service/$q),
	 *	This will cause a bunch of code from other files to run (such as loading the localization data),
	 *		which will cause the tests to fail unless httpBackend calls are stubbed and provided with fake data etc.
	 *	Using plain sinon allows us to avoid that
	 *
	 *
	 *	Basic usage:
	 *
	 *	Given a method q of object p, callback functions f1 and f2, and some array of arguments args
	 *		Then the call MockPromiseStubber.stubWithSuccess(p, q, result, args)
	 *			Will replace any occurence of the following call
	 *				return p.q(...args).then(f1, f2)
	 *			with
	 *				return f1(result)
	 *		and the call MockPromiseStubber.stubWithFailure(p, q, result, args) will replace it with
	 *				return f2(result)
	 *
	 *	If p.q is already a sinon stub, the methods setPromiseStubSuccess and setPromiseStubFailure can be called
	 *		with that instead
	 *
	 *	If args is removed, then p.1 will return callback(result) on every call
	 *
	 *
	 *	NOTE: MockPromiseStubber does not currently support stubbing a chain of promises*
	 *		eg. return p.q().then(f1).then(f3).then...
	 *		Stubbing p.q here will ignore following .then calls
	 *
	 */
	class MockPromiseStubber {

		/**
		 *	Makes a stubbed promise (stub) call the resolve or error function of the following 'then' with 'result'
		 *		and return the output of the callback
		 *	As such, this will not work with deeply nested promises
		 *
		 *	shouldSucceed is a boolean which specifies which function is called
		 *
		 *	If limitingArgs is provided, the promise stub will call the callback if it is called with those arguments
		 */
		static setPromiseStubBehavior(shouldSucceed, stub, result, limitingArgs) {
			let thenCallback = null;

			if (shouldSucceed) {
				thenCallback = (success, failure) => {
					return success(result);
				};
			} else {
				thenCallback = (success, failure) => {
					return failure(result);
				};
			}

			let thenStub = sinon.stub();

			if (limitingArgs) {
				stub.withArgs(...limitingArgs).returns({
					then: thenCallback
				});
			} else {
				stub.returns({
					then: thenCallback
				});
			}
		}

		/**
		 *	Utility function that calls setPromiseStubBehavior with shouldSucceed set to true
		 */
		static setPromiseStubSuccess(stub, result, limitingArgs) {
			return this.setPromiseStubBehavior(true, stub, result, limitingArgs);
		}

		/**
		 *	Utility function that calls setPromiseStubBehavior with shouldSucceed set to false
		 */
		static setPromiseStubFailure(stub, result, limitingArgs) {
			return this.setPromiseStubBehavior(false, stub, result, limitingArgs);
		}

		/**
		 *	Stubs the method object.method and calls setPromiseStubSuccess with that stub
		 */
		static stubWithSuccess(object, method, result, limitingArgs) {
			let stub = sinon.stub(object, method);
			this.setPromiseStubSuccess(stub, result, limitingArgs);
			return stub;
		}

		/**
		 *	Stubs the method object.method and calls setPromiseStubFailure with that stub
		 */
		static stubWithFailure(object, method, result, limitingArgs) {
			let stub = sinon.stub(object, method);
			this.setPromiseStubFailure(stub, result, limitingArgs);
			return stub;
		}
	}

	angular.module('plm360.mockObjects').value('MockPromiseStubber', MockPromiseStubber);
//}());
