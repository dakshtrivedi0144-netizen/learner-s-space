angular.module('learningPortalApp')
  .controller('ReferencesCtrl', ['$scope', '$location', 'DataService', function($scope, $location, DataService) {
    var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
    if (!user) { $location.path('/login'); return; }
    if (user.role === 'admin') { $location.path('/admin'); return; }
    if (user.role === 'faculty') { $location.path('/faculty'); return; }

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
