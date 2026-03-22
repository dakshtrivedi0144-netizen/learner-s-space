angular.module('learningPortalApp')
.controller('ChangePasswordCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }

  $scope.user = user;
  $scope.form = { oldPass: '', newPass: '', confirmPass: '' };
  $scope.msg = ''; $scope.err = ''; $scope.saving = false;

  $scope.goBack = function() {
    if (user.role === 'admin') $location.path('/admin');
    else if (user.role === 'faculty') $location.path('/faculty');
    else $location.path('/home');
  };

  $scope.submit = function() {
    $scope.err = ''; $scope.msg = '';
    if (!$scope.form.oldPass || !$scope.form.newPass || !$scope.form.confirmPass) {
      $scope.err = 'All fields are required.'; return;
    }
    if ($scope.form.newPass.length < 6) {
      $scope.err = 'New password must be at least 6 characters.'; return;
    }
    if ($scope.form.newPass !== $scope.form.confirmPass) {
      $scope.err = 'New passwords do not match.'; return;
    }
    $scope.saving = true;
    FirebaseService.changePassword(user.regNo, $scope.form.oldPass, $scope.form.newPass).then(function() {
      $scope.saving = false;
      $scope.msg = 'Password changed successfully!';
      $scope.form = { oldPass: '', newPass: '', confirmPass: '' };
    }).catch(function(e) { $scope.saving = false; $scope.err = e; });
  };
}]);
