angular.module('learningPortalApp')
.controller('AuthCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';

  if (localStorage.getItem(SESSION_KEY)) {
    var existing = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (existing) {
      if (existing.role === 'admin') $location.path('/admin');
      else if (existing.role === 'faculty') $location.path('/faculty');
      else $location.path('/home');
      return;
    }
  }

  $scope.mode = 'login';
  $scope.loginData = {};
  $scope.reg = {};
  $scope.error = '';
  $scope.success = '';
  $scope.loading = false;
  $scope.pendingApproval = false;

  $scope.faculties = [
    { name: 'Faculty of Engineering & Technology', branches: ['Computer Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'] },
    { name: 'Faculty of Science', branches: ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biotechnology', 'Microbiology'] },
    { name: 'Faculty of Commerce', branches: ['B.Com General', 'B.Com (CA)', 'BBA', 'MBA'] },
    { name: 'Faculty of Arts & Humanities', branches: ['English', 'History', 'Psychology', 'Sociology', 'Political Science'] },
    { name: 'Faculty of Pharmacy', branches: ['B.Pharm', 'M.Pharm', 'Pharm.D'] },
    { name: 'Faculty of Law', branches: ['B.A. LL.B', 'B.Com LL.B', 'LL.M'] }
  ];

  $scope.selectedBranches = [];

  $scope.onFacultyChange = function() {
    $scope.reg.branch = '';
    var found = $scope.faculties.find(function(f) { return f.name === $scope.reg.faculty; });
    $scope.selectedBranches = found ? found.branches : [];
  };

  $scope.register = function() {
    $scope.error = ''; $scope.success = ''; $scope.pendingApproval = false;
    var r = $scope.reg;
    if (!r.name || !r.regNo || !r.faculty || !r.branch || !r.semester || !r.password || !r.confirmPassword) {
      $scope.error = 'Please fill in all required fields.'; return;
    }
    if (r.password !== r.confirmPassword) {
      $scope.error = 'Passwords do not match.'; return;
    }
    if (r.password.length < 6) {
      $scope.error = 'Password must be at least 6 characters.'; return;
    }
    $scope.loading = true;

    // All self-registrations go to pending approval queue
    FirebaseService.submitPendingRegistration(r).then(function() {
      $scope.loading = false;
      $scope.pendingApproval = true;
      $scope.reg = {};
    }).catch(function(err) {
      $scope.loading = false;
      $scope.error = err;
    });
  };

  $scope.login = function() {
    $scope.error = ''; $scope.success = ''; $scope.pendingApproval = false;
    if (!$scope.loginData.regNo || !$scope.loginData.password) {
      $scope.error = 'Please enter registration number and password.'; return;
    }
    $scope.loading = true;
    FirebaseService.login($scope.loginData.regNo, $scope.loginData.password).then(function(user) {
      $scope.loading = false;
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      if (user.role === 'admin') $location.path('/admin');
      else if (user.role === 'faculty') $location.path('/faculty');
      else $location.path('/home');
    }).catch(function(err) {
      $scope.loading = false;
      $scope.error = err;
    });
  };
}]);
