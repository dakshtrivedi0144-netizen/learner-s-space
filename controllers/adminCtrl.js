angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.role !== 'admin') { $location.path('/home'); return; }

  var ALL_SUBJECTS = [
    { id: 'angularjs',        name: 'AngularJS',           icon: '🅰️' },
    { id: 'cloud-computing',  name: 'Cloud Computing',     icon: '☁️' },
    { id: 'dm-dw',            name: 'Data Mining & DW',    icon: '⛏️' }
  ];

  $scope.allSubjects  = ALL_SUBJECTS;
  $scope.users        = [];
  $scope.facultyList  = [];
  $scope.assignments  = {};   // { regNo: ['angularjs', ...] }
  $scope.loading      = true;
  $scope.error        = '';
  $scope.actionMsg    = '';
  $scope.searchTerm   = '';
  $scope.filterSem    = '';
  $scope.filterRole   = '';
  $scope.tab          = 'users';

  // ── Load users + assignments ──────────────────────────
  FirebaseService.getAllUsers().then(function(list) {
    $scope.loading = false;
    $scope.users = list.map(function(u) { u.newRole = u.role || 'student'; return u; });
    $scope.facultyList = list.filter(function(u) { return u.role === 'faculty'; });
  });

  FirebaseService.getAssignments().then(function(data) {
    $scope.assignments = data;
    // ensure every faculty has an array
    $scope.facultyList.forEach(function(f) {
      if (!$scope.assignments[f.regNo]) $scope.assignments[f.regNo] = [];
    });
  });

  // ── Helpers ───────────────────────────────────────────
  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var t  = $scope.searchTerm.toLowerCase();
      var ms = !t || (u.name||'').toLowerCase().includes(t) || (u.regNo||'').toLowerCase().includes(t) || (u.branch||'').toLowerCase().includes(t);
      var mSem  = !$scope.filterSem  || String(u.semester) === String($scope.filterSem);
      var mRole = !$scope.filterRole || (u.role || 'student') === $scope.filterRole;
      return ms && mSem && mRole;
    });
  };

  $scope.roleCount = function(role) {
    return $scope.users.filter(function(u) { return (u.role || 'student') === role; }).length;
  };

  // ── Role management ───────────────────────────────────
  $scope.updateRole = function(u) {
    FirebaseService.updateUserRole(u.regNo, u.newRole).then(function() {
      u.role = u.newRole;
      // refresh faculty list
      $scope.facultyList = $scope.users.filter(function(x) { return x.role === 'faculty'; });
      $scope.flash(u.name + ' role updated to ' + u.newRole);
    }).catch(function(err) { $scope.error = err; });
  };

  $scope.deleteUser = function(u) {
    if (!confirm('Delete ' + u.name + ' (' + u.regNo + ')? This cannot be undone.')) return;
    FirebaseService.deleteUser(u.regNo).then(function() {
      $scope.users = $scope.users.filter(function(x) { return x.regNo !== u.regNo; });
      $scope.facultyList = $scope.users.filter(function(x) { return x.role === 'faculty'; });
      $scope.flash(u.name + ' deleted.');
    }).catch(function(err) { $scope.error = err; });
  };

  // ── Subject assignment ────────────────────────────────
  $scope.isAssigned = function(regNo, subjectId) {
    return ($scope.assignments[regNo] || []).indexOf(subjectId) !== -1;
  };

  $scope.toggleSubject = function(regNo, subjectId) {
    if (!$scope.assignments[regNo]) $scope.assignments[regNo] = [];
    var idx = $scope.assignments[regNo].indexOf(subjectId);
    if (idx === -1) {
      $scope.assignments[regNo].push(subjectId);
    } else {
      $scope.assignments[regNo].splice(idx, 1);
    }
    FirebaseService.setFacultySubjects(regNo, $scope.assignments[regNo]).then(function() {
      $scope.flash('Assignment updated.');
    });
  };

  $scope.assignedNames = function(regNo) {
    var subs = $scope.assignments[regNo] || [];
    if (!subs.length) return 'None assigned';
    return subs.map(function(id) {
      var s = ALL_SUBJECTS.find(function(x) { return x.id === id; });
      return s ? s.icon + ' ' + s.name : id;
    }).join(', ');
  };

  // ── Flash message ─────────────────────────────────────
  $scope.flash = function(msg) {
    $scope.actionMsg = msg;
    setTimeout(function() { $scope.$apply(function() { $scope.actionMsg = ''; }); }, 3000);
  };
}]);
