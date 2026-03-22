angular.module('learningPortalApp')
.factory('FirebaseService', [function() {

  var KEYS = {
    users:         'ulp_users',
    syllabus:      'ulp_syllabus',
    practicals:    'ulp_practicals',
    settings:      'ulp_settings',
    labManuals:    'ulp_labManuals',
    assignments:   'ulp_assignments',
    notifications: 'ulp_notifications'
  };

  function get(key)    { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e) { return {}; } }
  function getArr(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e) { return []; } }
  function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function resolved(val) {
    return { then: function(fn) { var r = fn(val); return resolved(r); }, catch: function() { return this; } };
  }
  function rejected(msg) {
    return { then: function() { return this; }, catch: function(fn) { fn(msg); return this; } };
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
      return resolved();
    },

    login: function(regNo, password) {
      var users = get(KEYS.users);
      var u = users[regNo.toUpperCase()];
      if (!u) return rejected('Invalid registration number or password.');
      if (u.password !== password) return rejected('Invalid registration number or password.');
      return resolved(u);
    },

    // ── ADMIN ─────────────────────────────────────────────
    getAllUsers: function() {
      var users = get(KEYS.users);
      var list = Object.values(users).sort(function(a,b) { return b.createdAt > a.createdAt ? 1 : -1; });
      return resolved(list);
    },

    updateUserRole: function(regNo, role) {
      var users = get(KEYS.users);
      if (!users[regNo]) return rejected('User not found.');
      users[regNo].role = role;
      set(KEYS.users, users);
      return resolved();
    },

    deleteUser: function(regNo) {
      var users = get(KEYS.users);
      delete users[regNo];
      set(KEYS.users, users);
      return resolved();
    },

    // ── SYLLABUS (theory units) ───────────────────────────
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

    savePracticals: function(subjectId, list) {
      var all = get(KEYS.practicals);
      all[subjectId] = list;
      set(KEYS.practicals, all);
      return resolved();
    },

    // ── UPLOAD PERMISSION ─────────────────────────────────
    getUploadSettings: function(subjectId) {
      var all = get(KEYS.settings);
      return resolved(all[subjectId] || { uploadAllowed: false });
    },

    setUploadAllowed: function(subjectId, allowed) {
      var all = get(KEYS.settings);
      all[subjectId] = { uploadAllowed: allowed };
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

      // Create notification for admin + faculty
      var subjectNames = { 'angularjs':'AngularJS', 'cloud-computing':'Cloud Computing', 'dm-dw':'Data Mining & DW' };
      var notifs = getArr(KEYS.notifications);
      notifs.unshift({
        id: Date.now(),
        type: 'lab_manual',
        message: (studentName || regNo) + ' submitted lab manual for ' + (subjectNames[subjectId] || subjectId),
        subjectId: subjectId,
        regNo: regNo,
        studentName: studentName || regNo,
        createdAt: new Date().toISOString(),
        readBy: []   // array of regNos who have read this
      });
      // Keep only last 50 notifications
      if (notifs.length > 50) notifs = notifs.slice(0, 50);
      set(KEYS.notifications, notifs);

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
        if (n.id === notifId && n.readBy.indexOf(regNo) === -1) {
          n.readBy.push(regNo);
        }
      });
      set(KEYS.notifications, notifs);
      return resolved();
    },

    getUnreadCount: function(regNo) {
      var notifs = getArr(KEYS.notifications);
      var count = notifs.filter(function(n) { return n.readBy.indexOf(regNo) === -1; }).length;
      return resolved(count);
    }
  };
}]);
