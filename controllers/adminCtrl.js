angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.role !== 'admin') { $location.path('/home'); return; }

  $scope.users = [];
  $scope.loading = true;
  $scope.error = '';
  $scope.actionMsg = '';
  $scope.searchTerm = '';
  $scope.filterSem = '';
  $scope.filterRole = '';
  $scope.tab = 'users';

  FirebaseService.getAllUsers().then(function(list) {
    $scope.loading = false;
    $scope.users = list.map(function(u) {
      u.newRole = u.role || 'student'; return u;
    });
  }).catch(function(err) {
    $scope.loading = false;
    $scope.error = 'Failed to load users: ' + err;
  });

  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var t = $scope.searchTerm.toLowerCase();
      var ms = !t || (u.name||'').toLowerCase().includes(t) || (u.regNo||'').toLowerCase().includes(t) || (u.branch||'').toLowerCase().includes(t);
      var mSem = !$scope.filterSem || String(u.semester) === String($scope.filterSem);
      var mRole = !$scope.filterRole || (u.role || 'student') === $scope.filterRole;
      return ms && mSem && mRole;
    });
  };

  $scope.roleCount = function(role) {
    return $scope.users.filter(function(u) { return (u.role || 'student') === role; }).length;
  };

  $scope.updateRole = function(u) {
    FirebaseService.updateUserRole(u.regNo, u.newRole).then(function() {
      u.role = u.newRole;
      $scope.actionMsg = u.name + ' role updated to ' + u.newRole;
      setTimeout(function() { $scope.$apply(function() { $scope.actionMsg = ''; }); }, 3000);
    }).catch(function(err) { $scope.error = err; });
  };

  $scope.deleteUser = function(u) {
    if (!confirm('Delete user ' + u.name + ' (' + u.regNo + ')? This cannot be undone.')) return;
    FirebaseService.deleteUser(u.regNo).then(function() {
      $scope.users = $scope.users.filter(function(x) { return x.regNo !== u.regNo; });
      $scope.actionMsg = u.name + ' deleted.';
      setTimeout(function() { $scope.$apply(function() { $scope.actionMsg = ''; }); }, 3000);
    }).catch(function(err) { $scope.error = err; });
  };
}]);
