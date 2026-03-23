angular.module('learningPortalApp')
.factory('FirebaseService', ['$timeout', function($timeout) {

  var KEYS = {
    users:         'ulp_users',
    syllabus:      'ulp_syllabus',
    practicals:    'ulp_practicals',
    settings:      'ulp_settings',
    labManuals:    'ulp_labManuals',
    assignments:   'ulp_assignments',
    notifications: 'ulp_notifications',
    announcements: 'ulp_announcements',
    auditLog:      'ulp_auditLog',
    deadlines:     'ulp_deadlines',
    bookmarks:     'ulp_bookmarks',
    timers:        'ulp_timers',
    pendingUsers:  'ulp_pendingUsers'
  };

  function get(key)    { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e) { return {}; } }
  function getArr(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e) { return []; } }
  function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function resolved(val) {
    return {
      then: function(fn) {
        var next;
        $timeout(function() { next._val = fn(val); }, 0);
        next = resolved(undefined);
        return next;
      },
      catch: function() { return this; }
    };
  }
  function rejected(msg) {
    return {
      then: function() { return this; },
      catch: function(fn) { $timeout(function() { fn(msg); }, 0); return this; }
    };
  }

  function addAudit(action, by, detail) {
    var log = getArr(KEYS.auditLog);
    log.unshift({ id: Date.now(), action: action, by: by, detail: detail, at: new Date().toISOString() });
    if (log.length > 200) log = log.slice(0, 200);
    set(KEYS.auditLog, log);
  }

  return {

    // ── AUTH ──────────────────────────────────────────────
    register: function(userData) {
      var users = get(KEYS.users);
      var regNo = userData.regNo.toUpperCase();
      if (users[regNo]) return rejected('Registration number already exists.');
      users[regNo] = {
        name: userData.name, regNo: regNo,
        faculty: userData.faculty, branch: userData.branch,
        semester: userData.semester, role: userData.role || 'student',
        password: userData.password, createdAt: new Date().toISOString()
      };
      set(KEYS.users, users);
      addAudit('REGISTER', regNo, 'New account created');
      return resolved();
    },

    login: function(regNo, password) {
      var users = get(KEYS.users);
      var u = users[regNo.toUpperCase()];
      if (!u) return rejected('Invalid registration number or password.');
      if (u.password !== password) return rejected('Invalid registration number or password.');
      addAudit('LOGIN', regNo, 'User logged in');
      return resolved(u);
    },

    changePassword: function(regNo, oldPass, newPass) {
      var users = get(KEYS.users);
      var u = users[regNo.toUpperCase()];
      if (!u) return rejected('User not found.');
      if (u.password !== oldPass) return rejected('Current password is incorrect.');
      u.password = newPass;
      set(KEYS.users, users);
      addAudit('CHANGE_PASSWORD', regNo, 'Password changed');
      return resolved();
    },

    // ── ADMIN ─────────────────────────────────────────────
    getAllUsers: function() {
      var users = get(KEYS.users);
      var list = Object.values(users).sort(function(a,b) { return b.createdAt > a.createdAt ? 1 : -1; });
      return resolved(list);
    },

    updateUserRole: function(regNo, role, byUser) {
      var users = get(KEYS.users);
      if (!users[regNo]) return rejected('User not found.');
      users[regNo].role = role;
      set(KEYS.users, users);
      addAudit('ROLE_CHANGE', byUser || 'admin', regNo + ' → ' + role);
      return resolved();
    },

    deleteUser: function(regNo, byUser) {
      var users = get(KEYS.users);
      delete users[regNo];
      set(KEYS.users, users);
      addAudit('DELETE_USER', byUser || 'admin', 'Deleted: ' + regNo);
      return resolved();
    },

    // ── PENDING REGISTRATIONS ─────────────────────────────
    submitPendingRegistration: function(userData) {
      var pending = getArr(KEYS.pendingUsers);
      var regNo = userData.regNo.toUpperCase();
      var users = get(KEYS.users);
      if (users[regNo]) return rejected('Registration number already exists.');
      var already = pending.find(function(p) { return p.regNo === regNo; });
      if (already) return rejected('Registration already pending approval.');
      pending.unshift({ id: Date.now(), name: userData.name, regNo: regNo, faculty: userData.faculty, branch: userData.branch, semester: userData.semester, password: userData.password, submittedAt: new Date().toISOString(), status: 'pending' });
      set(KEYS.pendingUsers, pending);
      return resolved();
    },

    getPendingRegistrations: function() {
      return resolved(getArr(KEYS.pendingUsers));
    },

    approveRegistration: function(id, byUser) {
      var pending = getArr(KEYS.pendingUsers);
      var idx = pending.findIndex(function(p) { return p.id === id; });
      if (idx === -1) return rejected('Not found.');
      var p = pending[idx];
      var users = get(KEYS.users);
      users[p.regNo] = { name: p.name, regNo: p.regNo, faculty: p.faculty, branch: p.branch, semester: p.semester, role: 'student', password: p.password, createdAt: new Date().toISOString() };
      set(KEYS.users, users);
      pending.splice(idx, 1);
      set(KEYS.pendingUsers, pending);
      addAudit('APPROVE_REG', byUser || 'admin', 'Approved: ' + p.regNo);
      return resolved();
    },

    rejectRegistration: function(id, byUser) {
      var pending = getArr(KEYS.pendingUsers);
      var p = pending.find(function(x) { return x.id === id; });
      var filtered = pending.filter(function(x) { return x.id !== id; });
      set(KEYS.pendingUsers, filtered);
      addAudit('REJECT_REG', byUser || 'admin', 'Rejected: ' + (p ? p.regNo : id));
      return resolved();
    },

    // ── SYLLABUS ──────────────────────────────────────────
    getSyllabus: function(subjectId) {
      var all = get(KEYS.syllabus);
      return resolved(all[subjectId] || null);
    },

    saveSyllabus: function(subjectId, data) {
      var all = get(KEYS.syllabus);
      all[subjectId] = data;
      set(KEYS.syllabus, all);
      return resolved();
    },

    // ── PRACTICALS ────────────────────────────────────────
    getPracticals: function(subjectId) {
      var all = get(KEYS.practicals);
      return resolved(all[subjectId] || []);
    },

    savePracticals: function(subjectId, list, byUser) {
      var all = get(KEYS.practicals);
      all[subjectId] = list;
      set(KEYS.practicals, all);
      addAudit('SAVE_PRACTICALS', byUser || 'faculty', subjectId + ': ' + list.length + ' practicals');
      return resolved();
    },

    // ── STUDENT PROGRESS ──────────────────────────────────
    getAllStudentProgress: function(subjectId) {
      var users = get(KEYS.users);
      var result = [];
      Object.values(users).forEach(function(u) {
        if (u.role !== 'student') return;
        var key = 'ulp_progress_' + subjectId;
        var prog = {};
        try { prog = JSON.parse(localStorage.getItem(key)) || {}; } catch(e) {}
        var done = Object.values(prog).filter(function(p) { return p.completed; }).length;
        result.push({ regNo: u.regNo, name: u.name, completed: done });
      });
      return resolved(result);
    },

    // ── UPLOAD PERMISSION + DEADLINE ─────────────────────
    getUploadSettings: function(subjectId) {
      var all = get(KEYS.settings);
      return resolved(all[subjectId] || { uploadAllowed: false, deadline: null });
    },

    setUploadAllowed: function(subjectId, allowed, deadline) {
      var all = get(KEYS.settings);
      all[subjectId] = { uploadAllowed: allowed, deadline: deadline || null };
      set(KEYS.settings, all);
      return resolved();
    },

    // ── SUBJECT ASSIGNMENTS ───────────────────────────────
    getAssignments: function() {
      return resolved(get(KEYS.assignments));
    },

    getFacultySubjects: function(regNo) {
      var all = get(KEYS.assignments);
      return resolved(all[regNo] || []);
    },

    setFacultySubjects: function(regNo, subjects) {
      var all = get(KEYS.assignments);
      all[regNo] = subjects;
      set(KEYS.assignments, all);
      return resolved();
    },

    // ── LAB MANUALS ───────────────────────────────────────
    submitLabManual: function(subjectId, regNo, data, studentName) {
      var all = get(KEYS.labManuals);
      var key = subjectId + '_' + regNo;
      all[key] = {
        subjectId: subjectId, regNo: regNo,
        studentName: studentName || regNo,
        fileName: data.fileName || '',
        fileUrl: data.fileUrl || '',
        notes: data.notes || '',
        submittedAt: new Date().toISOString()
      };
      set(KEYS.labManuals, all);
      var subjectNames = { 'angularjs':'AngularJS', 'cloud-computing':'Cloud Computing', 'dm-dw':'Data Mining & DW' };
      var notifs = getArr(KEYS.notifications);
      notifs.unshift({
        id: Date.now(), type: 'lab_manual',
        message: (studentName || regNo) + ' submitted lab manual for ' + (subjectNames[subjectId] || subjectId),
        subjectId: subjectId, regNo: regNo, studentName: studentName || regNo,
        createdAt: new Date().toISOString(), readBy: []
      });
      if (notifs.length > 50) notifs = notifs.slice(0, 50);
      set(KEYS.notifications, notifs);
      addAudit('SUBMIT_MANUAL', regNo, subjectId);
      return resolved();
    },

    getLabManuals: function(subjectId) {
      var all = get(KEYS.labManuals);
      var list = Object.values(all).filter(function(m) { return m.subjectId === subjectId; });
      list.sort(function(a,b) { return b.submittedAt > a.submittedAt ? 1 : -1; });
      return resolved(list);
    },

    getAllLabManuals: function() {
      var all = get(KEYS.labManuals);
      var list = Object.values(all);
      list.sort(function(a,b) { return b.submittedAt > a.submittedAt ? 1 : -1; });
      return resolved(list);
    },

    getMyLabManual: function(subjectId, regNo) {
      var all = get(KEYS.labManuals);
      return resolved(all[subjectId + '_' + regNo] || null);
    },

    // ── NOTIFICATIONS ─────────────────────────────────────
    getNotifications: function() {
      return resolved(getArr(KEYS.notifications));
    },

    markNotificationRead: function(notifId, regNo) {
      var notifs = getArr(KEYS.notifications);
      notifs.forEach(function(n) {
        if (n.id === notifId && n.readBy.indexOf(regNo) === -1) n.readBy.push(regNo);
      });
      set(KEYS.notifications, notifs);
      return resolved();
    },

    getUnreadCount: function(regNo) {
      var notifs = getArr(KEYS.notifications);
      return resolved(notifs.filter(function(n) { return n.readBy.indexOf(regNo) === -1; }).length);
    },

    // ── ANNOUNCEMENTS ─────────────────────────────────────
    getAnnouncements: function() {
      return resolved(getArr(KEYS.announcements));
    },

    postAnnouncement: function(text, byUser) {
      var list = getArr(KEYS.announcements);
      list.unshift({ id: Date.now(), text: text, by: byUser, createdAt: new Date().toISOString(), pinned: false });
      if (list.length > 20) list = list.slice(0, 20);
      set(KEYS.announcements, list);
      addAudit('ANNOUNCEMENT', byUser, text.substring(0, 60));
      return resolved();
    },

    deleteAnnouncement: function(id) {
      var list = getArr(KEYS.announcements).filter(function(a) { return a.id !== id; });
      set(KEYS.announcements, list);
      return resolved();
    },

    // ── AUDIT LOG ─────────────────────────────────────────
    getAuditLog: function() {
      return resolved(getArr(KEYS.auditLog));
    },

    // ── BOOKMARKS ─────────────────────────────────────────
    getBookmarks: function(regNo) {
      var all = get(KEYS.bookmarks);
      return resolved(all[regNo] || []);
    },

    toggleBookmark: function(regNo, item) {
      var all = get(KEYS.bookmarks);
      if (!all[regNo]) all[regNo] = [];
      var idx = all[regNo].findIndex(function(b) { return b.id === item.id; });
      if (idx === -1) { all[regNo].unshift(item); }
      else { all[regNo].splice(idx, 1); }
      set(KEYS.bookmarks, all);
      return resolved(idx === -1);
    },

    isBookmarked: function(regNo, itemId) {
      var all = get(KEYS.bookmarks);
      return resolved(!!(all[regNo] || []).find(function(b) { return b.id === itemId; }));
    },

    // ── TIMERS ────────────────────────────────────────────
    getTimers: function(regNo) {
      var all = get(KEYS.timers);
      return resolved(all[regNo] || {});
    },

    saveTimer: function(regNo, practicalId, seconds) {
      var all = get(KEYS.timers);
      if (!all[regNo]) all[regNo] = {};
      all[regNo][practicalId] = seconds;
      set(KEYS.timers, all);
      return resolved();
    },

    // ── ANALYTICS ─────────────────────────────────────────
    getAnalytics: function() {
      var users      = get(KEYS.users);
      var manuals    = get(KEYS.labManuals);
      var practicals = get(KEYS.practicals);

      var studentList = Object.values(users).filter(function(u) { return u.role === 'student'; });
      var subjects = ['angularjs', 'cloud-computing', 'dm-dw'];
      var subjectNames = { 'angularjs':'AngularJS', 'cloud-computing':'Cloud Computing', 'dm-dw':'DM & DW' };

      var submissionsBySubject = {};
      subjects.forEach(function(s) {
        submissionsBySubject[s] = Object.values(manuals).filter(function(m) { return m.subjectId === s; }).length;
      });

      var totalPracticals = {};
      subjects.forEach(function(s) {
        totalPracticals[s] = (practicals[s] || []).length;
      });

      var studentStats = studentList.map(function(u) {
        var totalDone = 0, totalAll = 0;
        subjects.forEach(function(s) {
          var key = 'ulp_progress_' + s;
          var prog = {};
          try { prog = JSON.parse(localStorage.getItem(key)) || {}; } catch(e) {}
          totalDone += Object.values(prog).filter(function(p) { return p.completed; }).length;
          totalAll  += (practicals[s] || []).length;
        });
        return { name: u.name, regNo: u.regNo, done: totalDone, total: totalAll, pct: totalAll ? Math.round(totalDone / totalAll * 100) : 0 };
      });
      studentStats.sort(function(a, b) { return b.pct - a.pct; });

      return resolved({
        totalStudents: studentList.length,
        totalFaculty: Object.values(users).filter(function(u) { return u.role === 'faculty'; }).length,
        totalSubmissions: Object.values(manuals).length,
        submissionsBySubject: submissionsBySubject,
        totalPracticals: totalPracticals,
        studentStats: studentStats,
        subjects: subjects,
        subjectNames: subjectNames
      });
    }
  };
}]);
