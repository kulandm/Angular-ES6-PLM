'use strict';

/* jasmine specs for services go here */

describe('CommentsService', function () {
	var q, _, httpBackend;
	var mockRESTWrapperService;

	beforeEach(module('plm360','plmTemplates'));
	beforeEach(function () {
		mockRESTWrapperService = sinon.stub({
			get:function () {}
		});

		module(function ($provide) {
			$provide.value('PLM360.Token.service',mockRESTWrapperService);
		});
		inject(function ($q, _, $httpBackend) {
			q = $q;
			_ = _;
			httpBackend = $httpBackend;

			var mockLocalizationData = {
				text: {
					archived: {
						uppercase: 'ARCHIVED'
					}
				},
				notification: {
					pin: {
						success: ''
					},
					unpin: {
						success: ''
					},
					archive: {
						success: ''
					},
					unarchive: {
						success: ''
					}
				},
				revision: {
					neverInEffect: '',
					obsolete: '',
					pending: '',
					released: '',
					superseded: '',
					unreleased: '',
					working: ''
				}

			};
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);
		});
	});
	describe('get',function () {
		it('should get the list of comments', inject(function (CommentsService) {
			mockRESTWrapperService.get.returns(q.when(''));
			httpBackend.expectGET(/https:\/\/developer-stg.api.autodesk.com\/*/).respond(200, 'a');
			var val = 'testUrn';
			CommentsService.get(val).then(function (ret) {
				expect(ret.data).to.equal('a');
			});
			httpBackend.flush();
		}));
	});

	describe('postReply',function () {
		it('should post a reply to comment', inject(function (CommentsService) {
			mockRESTWrapperService.get.returns(q.when(''));
			httpBackend.expectPOST(/https:\/\/developer-stg.api.autodesk.com\/*/).respond(200, 'a');
			var val = 'testToken';
			CommentsService.postReply({
				encodedId: '',
				replyText: ''
			}, []).then(function (ret) {
				expect(ret.data).to.equal('a');
			});
			httpBackend.flush();
		}));
	});

	describe('postComment',function () {
		it('should post a comment', inject(function (CommentsService) {
			mockRESTWrapperService.get.returns(q.when(''));
			httpBackend.expectPOST(/https:\/\/developer-stg.api.autodesk.com\/*/).respond(200, 'a');
			var val = 'testUrn';
			CommentsService.postComment(val,{
				encodedId: '',
				replyText: ''
			}, []).then(function (ret) {
				expect(ret.data).to.equal('a');
			});
			httpBackend.flush();
		}));
	});
});
