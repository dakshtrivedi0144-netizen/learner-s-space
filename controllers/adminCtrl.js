angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', '$timeout', 'FirebaseService', function($scope, $location, $timeout, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.role !== 'admin') { $location.path('/home'); return; }

  var ALL_SUBJECTS = [
    { id: 'angularjs',       name: 'AngularJS',        icon: '🅰️' },
    { id: 'cloud-computing', name: 'Cloud Computing',  icon: '☁️' },
    { id: 'dm-dw',           name: 'Data Mining & DW', icon: '⛏️' }
  ];

  $scope.allSubjects        = ALL_SUBJECTS;
  $scope.users              = [];
  $scope.facultyList        = [];
  $scope.assignments        = {};
  $scope.loading            = true;
  $scope.error              = '';
  $scope.actionMsg          = '';
  $scope.searchTerm         = '';
  $scope.filterSem          = '';
  $scope.filterRole         = '';
  $scope.tab                = 'dashboard';

  $scope.contentSubject     = ALL_SUBJECTS[0];
  $scope.contentPracticals  = [];
  $scope.contentTheory      = [];
  $scope.loadingContent     = false;

  $scope.allSubmissions     = [];
  $scope.subFilter          = '';
  $scope.loadingSubmissions = false;

  $scope.notifications      = [];
  $scope.unreadCount        = 0;

  $scope.announcements      = [];
  $scope.newAnnouncement    = '';
  $scope.postingAnnounce    = false;

  $scope.analytics          = null;
  $scope.chartBars          = [];
  $scope.auditLog           = [];
  $scope.pendingUsers       = [];

  // ── Initial load ──────────────────────────────────────
  FirebaseService.getAllUsers().then(function(list) {
    $scope.loading = false;
    $scope.users = list.map(function(u) { u.newRole = u.role || 'student'; return u; });
    $scope.facultyList = list.filter(function(u) { return u.role === 'faculty'; });
  }).catch(function(err) { $scope.loading = false; $scope.error = err; });

  FirebaseService.getAssignments().then(function(data) {
    $scope.assignments = data;
  });

  loadNotifications();
  loadAnalytics();
  loadAnnouncements();
  loadPending();

  // ── Tab watcher ───────────────────────────────────────
  $scope.$watch('tab', function(t) {
    if (t === 'dashboard')     { loadAnalytics(); }
    if (t === 'content')       { loadContent($scope.contentSubject.id); }
    if (t === 'submissions')   { loadAllSubmissions(); }
    if (t === 'notifications') { loadNotifications(); }
    if (t === 'announcements') { loadAnnouncements(); }
    if (t === 'audit')         { loadAuditLog(); }
    if (t === 'pending')       { loadPending(); }
  });

  // ── Analytics ─────────────────────────────────────────
  function loadAnalytics() {
    FirebaseService.getAnalytics().then(function(data) {
      $scope.analytics = data;
      var maxVal = Math.max(1, Math.max.apply(null, ALL_SUBJECTS.map(function(s) {
        return data.submissionsBySubject[s.id] || 0;
      })));
      $scope.chartBars = ALL_SUBJECTS.map(function(s) {
        var count = data.submissionsBySubject[s.id] || 0;
        return { label: s.name.split(' ')[0], count: count, pct: Math.round(count / maxVal * 100) };
      });
    });
  }

  // ── Content ───────────────────────────────────────────
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

  // ── Submissions ───────────────────────────────────────
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

  // ── Announcements ─────────────────────────────────────
  function loadAnnouncements() {
    FirebaseService.getAnnouncements().then(function(list) {
      $scope.announcements = list;
    });
  }

  $scope.postAnnouncement = function() {
    var text = ($scope.newAnnouncement || '').trim();
    if (!text) return;
    $scope.postingAnnounce = true;
    FirebaseService.postAnnouncement(text, user.name).then(function() {
      $timeout(function() {
        $scope.newAnnouncement = '';
        $scope.postingAnnounce = false;
        loadAnnouncements();
        $scope.actionMsg = '✅ Announcement posted!';
        $timeout(function() { $scope.actionMsg = ''; }, 3000);
      });
    });
  };

  $scope.deleteAnnouncement = function(id) {
    FirebaseService.deleteAnnouncement(id).then(function() {
      $timeout(function() {
        $scope.announcements = $scope.announcements.filter(function(a) { return a.id !== id; });
      });
    });
  };

  // ── Audit Log ─────────────────────────────────────────
  function loadAuditLog() {
    FirebaseService.getAuditLog().then(function(list) {
      $scope.auditLog = list;
    });
  }

  // ── Pending Registrations ─────────────────────────────
  function loadPending() {
    FirebaseService.getPendingRegistrations().then(function(list) {
      $scope.pendingUsers = list;
    });
  }

  $scope.approveUser = function(p) {
    FirebaseService.approveRegistration(p.id, user.regNo).then(function() {
      $scope.pendingUsers = $scope.pendingUsers.filter(function(x) { return x.id !== p.id; });
      FirebaseService.getAllUsers().then(function(list) {
        $scope.users = list.map(function(u) { u.newRole = u.role || 'student'; return u; });
        $scope.facultyList = list.filter(function(u) { return u.role === 'faculty'; });
      });
      $scope.flash(p.name + ' approved and added as student.');
    });
  };

  $scope.rejectUser = function(p) {
    FirebaseService.rejectRegistration(p.id, user.regNo).then(function() {
      $scope.pendingUsers = $scope.pendingUsers.filter(function(x) { return x.id !== p.id; });
      $scope.flash('Registration rejected.');
    });
  };

  // ── Notifications ─────────────────────────────────────
  function loadNotifications() {
    FirebaseService.getNotifications().then(function(list) {
      $scope.notifications = list;
      $scope.unreadCount = list.filter(function(n) { return n.readBy.indexOf(user.regNo) === -1; }).length;
    });
  }

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

  // ── User management ───────────────────────────────────
  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var t     = $scope.searchTerm.toLowerCase();
      var ms    = !t || (u.name||'').toLowerCase().includes(t) || (u.regNo||'').toLowerCase().includes(t) || (u.branch||'').toLowerCase().includes(t);
      var mSem  = !$scope.filterSem  || String(u.semester) === String($scope.filterSem);
      var mRole = !$scope.filterRole || (u.role||'student') === $scope.filterRole;
      return ms && mSem && mRole;
    });
  };

  $scope.roleCount = function(role) {
    return $scope.users.filter(function(u) { return (u.role||'student') === role; }).length;
  };

  $scope.updateRole = function(u) {
    FirebaseService.updateUserRole(u.regNo, u.newRole, user.regNo).then(function() {
      u.role = u.newRole;
      $scope.facultyList = $scope.users.filter(function(x) { return x.role === 'faculty'; });
      $scope.flash(u.name + ' role updated to ' + u.newRole);
    }).catch(function(err) { $scope.error = err; });
  };

  $scope.deleteUser = function(u) {
    if (!confirm('Delete ' + u.name + ' (' + u.regNo + ')? This cannot be undone.')) return;
    FirebaseService.deleteUser(u.regNo, user.regNo).then(function() {
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

  // ── Flash message ─────────────────────────────────────
  $scope.flash = function(msg) {
    $scope.actionMsg = msg;
    $timeout(function() { $scope.actionMsg = ''; }, 3000);
  };
}]);
