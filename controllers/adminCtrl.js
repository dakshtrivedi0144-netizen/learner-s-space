angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.role !== 'admin') { $location.path('/home'); return; }

  var ALL_SUBJECTS = [
    { id: 'angularjs',       name: 'AngularJS',        icon: '🅰️' },
    { id: 'cloud-computing', name: 'Cloud Computing',  icon: '☁️' },
    { id: 'dm-dw',           name: 'Data Mining & DW', icon: '⛏️' }
  ];

  $scope.allSubjects    = ALL_SUBJECTS;
  $scope.users          = [];
  $scope.facultyList    = [];
  $scope.assignments    = {};
  $scope.loading        = true;
  $scope.error          = '';
  $scope.actionMsg      = '';
  $scope.searchTerm     = '';
  $scope.filterSem      = '';
  $scope.filterRole     = '';
  $scope.tab            = 'users';

  // Content tab
  $scope.contentSubject  = ALL_SUBJECTS[0];
  $scope.contentPracticals = [];
  $scope.contentTheory     = [];
  $scope.loadingContent    = false;

  // Submissions tab
  $scope.allSubmissions    = [];
  $scope.subFilter         = '';
  $scope.loadingSubmissions = false;

  // Notifications tab
  $scope.notifications     = [];
  $scope.unreadCount       = 0;

  // ── Load users + assignments ──────────────────────────
  FirebaseService.getAllUsers().then(function(list) {
    $scope.loading = false;
    $scope.users = list.map(function(u) { u.newRole = u.role || 'student'; return u; });
    $scope.facultyList = list.filter(function(u) { return u.role === 'faculty'; });
  });

  FirebaseService.getAssignments().then(function(data) {
    $scope.assignments = data;
  });

  // Load notifications on init
  loadNotifications();

  function loadNotifications() {
    FirebaseService.getNotifications().then(function(list) {
      $scope.notifications = list;
      $scope.unreadCount = list.filter(function(n) { return n.readBy.indexOf(user.regNo) === -1; }).length;
    });
  }

  // ── Tab change handler ────────────────────────────────
  $scope.$watch('tab', function(t) {
    if (t === 'content') {
      loadContent($scope.contentSubject.id);
    }
    if (t === 'submissions') {
      loadAllSubmissions();
    }
    if (t === 'notifications') {
      loadNotifications();
    }
  });

  // ── Content loading ───────────────────────────────────
  $scope.selectContentSubject = function(s) {
    $scope.contentSubject = s;
    loadContent(s.id);
  };

  function loadContent(subjectId) {
    $scope.loadingContent = true;
    FirebaseService.getPracticals(subjectId).then(function(list) {
      $scope.contentPracticals = list || [];
      $scope.loadingContent = false;
    });
    FirebaseService.getSyllabus(subjectId).then(function(data) {
      $scope.contentTheory = data ? data.units || [] : [];
    });
  }

  // ── Submissions loading ───────────────────────────────
  function loadAllSubmissions() {
    $scope.loadingSubmissions = true;
    FirebaseService.getAllLabManuals().then(function(list) {
      $scope.allSubmissions = list;
      $scope.loadingSubmissions = false;
    });
  }

  $scope.filteredSubmissions = function() {
    if (!$scope.subFilter) return $scope.allSubmissions;
    return $scope.allSubmissions.filter(function(s) { return s.subjectId === $scope.subFilter; });
  };

  $scope.subjectName = function(id) {
    var s = ALL_SUBJECTS.find(function(x) { return x.id === id; });
    return s ? s.icon + ' ' + s.name : id;
  };

  // ── Notifications ─────────────────────────────────────
  $scope.markRead = function(n) {
    if (n.readBy.indexOf(user.regNo) !== -1) return;
    FirebaseService.markNotificationRead(n.id, user.regNo).then(function() {
      n.readBy.push(user.regNo);
      $scope.unreadCount = Math.max(0, $scope.unreadCount - 1);
    });
  };

  $scope.markAllRead = function() {
    $scope.notifications.forEach(function(n) {
      if (n.readBy.indexOf(user.regNo) === -1) {
        FirebaseService.markNotificationRead(n.id, user.regNo);
        n.readBy.push(user.regNo);
      }
    });
    $scope.unreadCount = 0;
  };

  $scope.isUnread = function(n) { return n.readBy.indexOf(user.regNo) === -1; };

  // ── User helpers ──────────────────────────────────────
  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var t  = $scope.searchTerm.toLowerCase();
      var ms = !t || (u.name||'').toLowerCase().includes(t) || (u.regNo||'').toLowerCase().includes(t) || (u.branch||'').toLowerCase().includes(t);
      var mSem  = !$scope.filterSem  || String(u.semester) === String($scope.filterSem);
      var mRole = !$scope.filterRole || (u.role||'student') === $scope.filterRole;
      return ms && mSem && mRole;
    });
  };

  $scope.roleCount = function(role) {
    return $scope.users.filter(function(u) { return (u.role||'student') === role; }).length;
  };

  $scope.updateRole = function(u) {
    FirebaseService.updateUserRole(u.regNo, u.newRole).then(function() {
      u.role = u.newRole;
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
    if (idx === -1) { $scope.assignments[regNo].push(subjectId); }
    else            { $scope.assignments[regNo].splice(idx, 1); }
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

  $scope.flash = function(msg) {
    $scope.actionMsg = msg;
    setTimeout(function() { $scope.$apply(function() { $scope.actionMsg = ''; }); }, 3000);
  };
}]);
