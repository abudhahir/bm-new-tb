angular.module('navController', [])
.controller('nav', function($scope, $state, $sce, $location) {
	$scope.title = 'My Own Bookmark digger';
		// returns true if the current router url matches the passed in url
		// so views can set 'active' on links easily
/*$scope.$on('$locationChangeStart', function (event, newLoc, oldLoc){
	$scope.searchBm = newLoc;
   console.log('changing to: ' + newLoc);
});

$scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc){
	$scope.searchBm = newLoc;
   console.log('changed to: ' + newLoc);
});
*/

		$scope.isUrl = function(url) {
			if (url === '#') return false;
			return ('#' + $state.$current.url.source + '/').indexOf(url + '/') === 0;
		};

		$scope.pages = [
		{
			name: 'Home',
			url: '#/'
		}

		];

		$scope.highlight = function(text, search) {
			if (!search) {
				return $sce.trustAsHtml(text);
			}
//			return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="label label-primary">$&</span>'));
			return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<mark class="bg-info">$&</mark>'));
		};
		//console.log("starting");
		$scope.bmItems = [];
		var bookmarkTreeNodes = chrome.bookmarks.getTree(
			function(bookmarkTreeNodes) {
				//console.log(bookmarkTreeNodes);
				traverseBookmarks(bookmarkTreeNodes, []);
			});
		function constructTreeLabels(treeLevelArray)
		{
			if(treeLevelArray.length>0)
			{
				var treeJson = [];
				angular.forEach(treeLevelArray, function(item)
					{
						this.push( {"treeItem":item});
					}, treeJson);
				return treeJson;
			}
		}
		function traverseBookmarks(bookmarkTreeNodes, treeLevel) {
			for(var i=0;i<bookmarkTreeNodes.length;i++) {
				//console.log($scope.bmItems);
				if(bookmarkTreeNodes[i].children) {
					treeLevel.push(bookmarkTreeNodes[i].title);
					traverseBookmarks(bookmarkTreeNodes[i].children,treeLevel);
					treeLevel.splice(treeLevel.length-1, 1);
				} 
				else
				{

					$scope.bmItems.push({"title":bookmarkTreeNodes[i].title, "url" : bookmarkTreeNodes[i].url, "tree" : constructTreeLabels(treeLevel)});
				}

			}
		}
	});
