app.controller('websitesController', ['$scope', '$resource', function ($scope, $resource) {
	var Monitor = $resource('/api/websites');

	Monitor.query(function (results) {
		$scope.websites = results;
	});

	$scope.websites = []

	$scope.addWebsites = function() {
		var monitor = new Monitor();
		monitor.name = $scope.websiteName;
		monitor.url = $scope.websiteURL;
		monitor.$save(function(result) {
			$scope.websites.push(result);
			$scope.websiteURL = ""
			$scope.websiteName = ""
		});
	}
}]);