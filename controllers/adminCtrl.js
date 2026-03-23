angular.module('learningPortalApp')
.controller('AdminCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || user.role !== 'admin') { $location.path('/home'); return; }

  var ALL_SUBJECTS = [
    { id: 'angularjs',       name: 'AngularJS',        icon: '🅰️' },
    { id: 'cloud-computing', name: 'Cloud Computing',  icon: '☁️' },
    { id: 'dm-dw',           name: 'Data Mining & DW', icon: '⛏️' }
  ];

  // ── localStorage helpers ──────────────────────────────
  function lsGet(key)    { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e) { return {}; } }
  function lsArr(key)    { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e) { return []; } }
  function lsSet(key, v) { localStorage.setItem(key, JSON.stringify(v)); }

  function addAudit(action, detail) {
    var log = lsArr('ulp_auditLog');
    log.unshift({ id: Date.now(), action: action, by: user.regNo, detail: detail, at: new Date().toISOString() });
    if (log.length > 200) log = log.slice(0, 200);
    lsSet('ulp_auditLog', log);
  }

  // ── Scope init ────────────────────────────────────────
  $scope.allSubjects        = ALL_SUBJECTS;
  $scope.tab                = 'dashboard';
  $scope.actionMsg          = '';
  $scope.searchTerm         = '';
  $scope.filterSem          = '';
  $scope.filterRole         = '';

  $scope.contentSubject     = ALL_SUBJECTS[0];
  $scope.contentPracticals  = [];
  $scope.contentTheory      = [];

  $scope.subFilter          = '';
  $scope.announcements      = [];
  $scope.newAnnouncement    = '';
  $scope.analytics          = null;
  $scope.chartBars          = [];
  $scope.auditLog           = [];
  $scope.pendingUsers       = [];
  $scope.notifications      = [];
  $scope.unreadCount        = 0;

  // ── Load users & assignments synchronously ────────────
  function loadUsers() {
    var users = lsGet('ulp_users');
    var list = Object.values(users).sort(function(a,b) { return b.createdAt > a.createdAt ? 1 : -1; });
    $scope.users = list.map(function(u) { u.newRole = u.role || 'student'; return u; });
    $scope.facultyList = list.filter(function(u) { return u.role === 'faculty'; });
  }
  loadUsers();
  $scope.assignments = lsGet('ulp_assignments');
  $scope.loading = false;

  // ── Tab watcher ───────────────────────────────────────
  $scope.$watch('tab', function(t) {
    if (t === 'dashboard')     { loadAnalytics(); }
    if (t === 'content')       { loadContent($scope.contentSubject.id); }
    if (t === 'submissions')   { loadAllSubmissions(); }
    if (t === 'notifications') { loadNotifications(); }
    if (t === 'announcements') { loadAnnouncements(); }
    if (t === 'audit')         { $scope.auditLog = lsArr('ulp_auditLog'); }
    if (t === 'pending')       { $scope.pendingUsers = lsArr('ulp_pendingUsers'); }
  });

  // ── Analytics ─────────────────────────────────────────
  function loadAnalytics() {
    var users      = lsGet('ulp_users');
    var manuals    = lsGet('ulp_labManuals');
    var practicals = lsGet('ulp_practicals');
    var studentList = Object.values(users).filter(function(u) { return u.role === 'student'; });
    var subjects = ['angularjs', 'cloud-computing', 'dm-dw'];

    var submissionsBySubject = {};
    subjects.forEach(function(s) {
      submissionsBySubject[s] = Object.values(manuals).filter(function(m) { return m.subjectId === s; }).length;
    });
    var totalPracticals = {};
    subjects.forEach(function(s) { totalPracticals[s] = (practicals[s] || []).length; });

    var studentStats = studentList.map(function(u) {
      var done = 0, total = 0;
      subjects.forEach(function(s) {
        var prog = {};
        try { prog = JSON.parse(localStorage.getItem('ulp_progress_' + s)) || {}; } catch(e) {}
        done  += Object.values(prog).filter(function(p) { return p.completed; }).length;
        total += (practicals[s] || []).length;
      });
      return { name: u.name, regNo: u.regNo, done: done, total: total, pct: total ? Math.round(done/total*100) : 0 };
    });
    studentStats.sort(function(a,b) { return b.pct - a.pct; });

    $scope.analytics = {
      totalStudents: studentList.length,
      totalFaculty: Object.values(users).filter(function(u) { return u.role === 'faculty'; }).length,
      totalSubmissions: Object.values(manuals).length,
      submissionsBySubject: submissionsBySubject,
      totalPracticals: totalPracticals,
      studentStats: studentStats
    };

    var maxVal = Math.max(1, Math.max.apply(null, ALL_SUBJECTS.map(function(s) {
      return submissionsBySubject[s.id] || 0;
    })));
    $scope.chartBars = ALL_SUBJECTS.map(function(s) {
      var count = submissionsBySubject[s.id] || 0;
      return { label: s.name.split(' ')[0], count: count, pct: Math.round(count/maxVal*100) };
    });
  }

  // ── Content ───────────────────────────────────────────
  $scope.selectContentSubject = function(s) {
    $scope.contentSubject = s;
    loadContent(s.id);
  };
  function loadContent(subjectId) {
    var practicals = lsGet('ulp_practicals');
    $scope.contentPracticals = practicals[subjectId] || [];
    var syllabus = lsGet('ulp_syllabus');
    $scope.contentTheory = syllabus[subjectId] ? syllabus[subjectId].units || [] : [];
  }

  // ── Submissions ───────────────────────────────────────
  function loadAllSubmissions() {
    var all = lsGet('ulp_labManuals');
    $scope.allSubmissions = Object.values(all).sort(function(a,b) { return b.submittedAt > a.submittedAt ? 1 : -1; });
  }
  $scope.allSubmissions = [];
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
    $scope.announcements = lsArr('ulp_announcements');
  }
  loadAnnouncements();

  $scope.postAnnouncement = function() {
    var text = ($scope.newAnnouncement || '').trim();
    if (!text) return;
    var list = lsArr('ulp_announcements');
    list.unshift({ id: Date.now(), text: text, by: user.name, createdAt: new Date().toISOString() });
    lsSet('ulp_announcements', list);
    addAudit('ANNOUNCEMENT', text.substring(0, 60));
    $scope.announcements = list;
    $scope.newAnnouncement = '';
    $scope.flash('✅ Announcement posted!');
  };

  $scope.deleteAnnouncement = function(id) {
    var list = lsArr('ulp_announcements').filter(function(a) { return a.id !== id; });
    lsSet('ulp_announcements', list);
    $scope.announcements = list;
  };

  // ── Audit Log ─────────────────────────────────────────
  // loaded in tab watcher

  // ── Pending Registrations ─────────────────────────────
  $scope.pendingUsers = lsArr('ulp_pendingUsers');

  $scope.approveUser = function(p) {
    var pending = lsArr('ulp_pendingUsers');
    var idx = pending.findIndex(function(x) { return x.id === p.id; });
    if (idx === -1) return;
    var users = lsGet('ulp_users');
    users[p.regNo] = { name: p.name, regNo: p.regNo, faculty: p.faculty, branch: p.branch, semester: p.semester, role: 'student', password: p.password, createdAt: new Date().toISOString() };
    lsSet('ulp_users', users);
    pending.splice(idx, 1);
    lsSet('ulp_pendingUsers', pending);
    addAudit('APPROVE_REG', 'Approved: ' + p.regNo);
    $scope.pendingUsers = pending;
    loadUsers();
    $scope.flash(p.name + ' approved.');
  };

  $scope.rejectUser = function(p) {
    var pending = lsArr('ulp_pendingUsers').filter(function(x) { return x.id !== p.id; });
    lsSet('ulp_pendingUsers', pending);
    addAudit('REJECT_REG', 'Rejected: ' + p.regNo);
    $scope.pendingUsers = pending;
    $scope.flash('Registration rejected.');
  };

  // ── Notifications ─────────────────────────────────────
  function loadNotifications() {
    var list = lsArr('ulp_notifications');
    $scope.notifications = list;
    $scope.unreadCount = list.filter(function(n) { return n.readBy.indexOf(user.regNo) === -1; }).length;
  }
  loadNotifications();

  $scope.markRead = function(n) {
    if (n.readBy.indexOf(user.regNo) !== -1) return;
    var notifs = lsArr('ulp_notifications');
    notifs.forEach(function(x) { if (x.id === n.id) x.readBy.push(user.regNo); });
    lsSet('ulp_notifications', notifs);
    n.readBy.push(user.regNo);
    $scope.unreadCount = Math.max(0, $scope.unreadCount - 1);
  };

  $scope.markAllRead = function() {
    var notifs = lsArr('ulp_notifications');
    notifs.forEach(function(n) { if (n.readBy.indexOf(user.regNo) === -1) n.readBy.push(user.regNo); });
    lsSet('ulp_notifications', notifs);
    $scope.notifications.forEach(function(n) { if (n.readBy.indexOf(user.regNo) === -1) n.readBy.push(user.regNo); });
    $scope.unreadCount = 0;
  };

  $scope.isUnread = function(n) { return n.readBy.indexOf(user.regNo) === -1; };

  // ── User management ───────────────────────────────────
  $scope.filteredUsers = function() {
    return $scope.users.filter(function(u) {
      var t = $scope.searchTerm.toLowerCase();
      var ms   = !t || (u.name||'').toLowerCase().includes(t) || (u.regNo||'').toLowerCase().includes(t) || (u.branch||'').toLowerCase().includes(t);
      var mSem = !$scope.filterSem  || String(u.semester) === String($scope.filterSem);
      var mRole= !$scope.filterRole || (u.role||'student') === $scope.filterRole;
      return ms && mSem && mRole;
    });
  };

  $scope.roleCount = function(role) {
    return $scope.users.filter(function(u) { return (u.role||'student') === role; }).length;
  };

  $scope.updateRole = function(u) {
    var users = lsGet('ulp_users');
    if (!users[u.regNo]) return;
    users[u.regNo].role = u.newRole;
    lsSet('ulp_users', users);
    addAudit('ROLE_CHANGE', u.regNo + ' → ' + u.newRole);
    u.role = u.newRole;
    $scope.facultyList = $scope.users.filter(function(x) { return x.role === 'faculty'; });
    $scope.flash(u.name + ' role updated to ' + u.newRole);
  };

  $scope.deleteUser = function(u) {
    if (!confirm('Delete ' + u.name + ' (' + u.regNo + ')? This cannot be undone.')) return;
    var users = lsGet('ulp_users');
    delete users[u.regNo];
    lsSet('ulp_users', users);
    addAudit('DELETE_USER', 'Deleted: ' + u.regNo);
    $scope.users = $scope.users.filter(function(x) { return x.regNo !== u.regNo; });
    $scope.facultyList = $scope.users.filter(function(x) { return x.role === 'faculty'; });
    $scope.flash(u.name + ' deleted.');
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
    lsSet('ulp_assignments', $scope.assignments);
    $scope.flash('Assignment updated.');
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

  // ── Initial dashboard load ────────────────────────────
  loadAnalytics();
}]);
