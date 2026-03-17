angular.module('learningPortalApp')
  .controller('ReferencesCtrl', ['$scope', 'DataService', function($scope, DataService) {
    $scope.loading = true;
    $scope.textbooks = [];
    $scope.error = '';

    DataService.getTextbooks()
      .then(function(data) {
        $scope.textbooks = data;
        $scope.loading = false;
      })
      .catch(function() {
        $scope.error = 'Failed to load textbooks. Please try again.';
        $scope.loading = false;
      });
  }]);
