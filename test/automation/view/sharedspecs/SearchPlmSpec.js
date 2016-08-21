// 'use strict';

// var searchPlm = require('../../components/SearchPlm');

// class SearchPlmSpec {

// 	/**
// 	 * @ngdoc method
// 	 * @name MenuButtonSpec.SharedSpec#run
// 	 * @methodOf MenuButtonSpec
// 	 * @description Run the tests for a Main Menu button, it is used from SharedSpecs
// 	 */
// 	run() {
// 		describe('Should pass SearchPlm tests ', ()=> {
// 			it('should be present in the page', (done) => {
// 				searchPlm.isDisplayed().then((result)=>{
// 					expect(result).to.equal(true);
// 					done();
// 				});
// 			});

// 			it('should search input has focus when the search button is clicked', (done) =>{
// 				searchPlm.clickOnSearchButton().then(() => {
// 					searchPlm.isSearchInputFocused().then((isFocused) => {
// 						expect(isFocused).to.equal(true);
// 						done();	
// 					});
// 				});
// 			});
// 		});
// 	}

// }

// module.exports = new SearchPlmSpec();
