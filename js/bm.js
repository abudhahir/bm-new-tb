(function() {
	var bm = angular.module('bm', ['ui.router', 'navController', 'ngAnimate', 'ui.bootstrap']);


	// define for requirejs loaded modules
	define('bm', [], function() { return bm; });

	// function for dynamic load with requirejs of a javascript module for use with a view
	// in the state definition call add property `resolve: req('/views/ui.js')`
	// or `resolve: req(['/views/ui.js'])`
	// or `resolve: req('views/ui')`
	function req(deps) {
		if (typeof deps === 'string') deps = [deps];
		return {
			deps: function ($q, $rootScope) {
				var deferred = $q.defer();
				require(deps, function() {
					$rootScope.$apply(function () {
						deferred.resolve();
					});
					deferred.resolve();
				});
				return deferred.promise;
			}
		}
	}

	bm.config(function($stateProvider, $urlRouterProvider, $controllerProvider){
		var origController = bm.controller
		bm.controller = function (name, constructor){
				$controllerProvider.register(name, constructor);
			return origController.apply(this, arguments);
		}

		var viewsPrefix = 'views/';

		// For any unmatched url, send to /
		$urlRouterProvider.otherwise("/")

		$stateProvider
			// you can set this to no template if you just want to use the html in the page
			.state('home', {
				url: "/",
				templateUrl: viewsPrefix + "home.html",
				data: {
					pageTitle: 'Home'
				}
			})
		})
	.directive('updateTitle', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				link: function(scope, element) {
					var listener = function(event, toState) {
						var title = 'Bookmark';
						if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - ' + title;
						$timeout(function() {
							element.text(title);
						}, 0, false);
					};

					$rootScope.$on('$stateChangeSuccess', listener);
				}
			};
		}
		])
	.directive('showOnRowHover',

		function () {
			return {
				link: function (scope, element, attrs) {

					element.closest('tr').bind('mouseenter', function () {
						element.show();
					});
					element.closest('tr').bind('mouseleave', function () {
						element.hide();

						var contextmenu = element.find('#contextmenu');
						contextmenu.click();

						element.parent().removeClass('open');

					});

				}
			};
		});
}());