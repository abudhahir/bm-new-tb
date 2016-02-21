angular.module('navController', [])
.controller('nav', function($scope, $state, $sce, $location) {
	$scope.title = 'My Own Bookmark digger';


	chrome.storage.sync.get(["showtags"], function(items){
		$scope.showtags = items.showtags;

	    console.log(items.showtags);
	});


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

		$scope.saveValue = 	function(){chrome.storage.sync.set({ "showtags": $scope.showtags }, function(){
	    console.log("saved...");
		})};
		
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
