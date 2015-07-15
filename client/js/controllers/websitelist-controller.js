app.controller('addWebsiteController', ['$scope', '$resource', function ($scope, $resource) {

	var Monitor = $resource('/api/websites');

	$scope.addWebsites = function() {
		var monitor = new Monitor();
		monitor.name = $scope.websiteName;
		monitor.url = $scope.websiteURL;
		monitor.pollInterval = $scope.pollInterval;
		monitor.mailID = $scope.mailID;
		monitor.mobileNumber = $scope.mobileNumber;
		monitor.mobileProvider = $scope.mobileProvider;

		monitor.$save(function(result) {
			$scope.websites.push(result);

			$scope.websiteName = "";
			$scope.websiteURL = "";
			$scope.pollInterval = "";
			$scope.mailID = "";
			$scope.mobileNumber = "";
			$scope.mobileProvider = "";
		});
	}
}]);