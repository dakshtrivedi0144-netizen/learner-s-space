angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', function($scope, $location) {

  var SESSION_KEY = 'ulp_session';
  var ADMIN_REG = 'ADMIN001'; // change this to your reg number

  // Only allow admin
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.regNo !== ADMIN_REG) {
    $location.path('/home');
    return;
  }

  $scope.users = [];
  $scope.loading = true;
  $scope.error = '';
  $scope.searchTerm = '';
  $scope.filterSem = '';
  $scope.filterBranch = '';
  $scope.branches = [];

  db.collection('users').orderBy('createdAt', 'desc').get()
    .then(function(snapshot) {
      $scope.loading = false;
      var branchSet = {};
      snapshot.forEach(function(doc) {
        var u = doc.data();
        $scope.users.push(u);
        if (u.branch) branchSet[u.branch] = true;
      });
      $scope.branches = Object.keys(branchSet).sort();
      $scope.$apply();
    })
    .catch(function(err) {
      $scope.loading = false;
      $scope.error = 'Failed to load users: ' + (err.message || err);
      $scope.$apply();
    });

  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var term = $scope.searchTerm.toLowerCase();
      var matchSearch = !term ||
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.regNo && u.regNo.toLowerCase().includes(term)) ||
        (u.branch && u.branch.toLowerCase().includes(term));
      var matchSem = !$scope.filterSem || String(u.semester) === String($scope.filterSem);
      var matchBranch = !$scope.filterBranch || u.branch === $scope.filterBranch;
      return matchSearch && matchSem && matchBranch;
    });
  };

  $scope.semCount = function() {
    var sems = {};
    $scope.users.forEach(function(u) { if (u.semester) sems[u.semester] = true; });
    return Object.keys(sems).length;
  };
}]);
