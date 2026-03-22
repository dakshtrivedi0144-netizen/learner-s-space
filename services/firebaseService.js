// Firebase Config
var firebaseConfig = {
  apiKey: "AIzaSyBLj0nCbh_plECf-0nUxKWcjEI_tVj490I",
  authDomain: "learning-portal-502c9.firebaseapp.com",
  projectId: "learning-portal-502c9",
  storageBucket: "learning-portal-502c9.firebasestorage.app",
  messagingSenderId: "106062258413",
  appId: "1:106062258413:web:3b18e038d06372c1f9ece4"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

angular.module('learningPortalApp')
.factory('FirebaseService', ['$q', function($q) {

  function wrap(promise) {
    var d = $q.defer();
    promise.then(function(r) { d.resolve(r); })
           .catch(function(e) { d.reject(e.code === 'permission-denied' ? 'Permission denied.' : (e.message || 'Operation failed.')); });
    return d.promise;
  }

  return {

    // ── AUTH ──────────────────────────────────────────────
    register: function(userData) {
      var d = $q.defer();
      var docRef = db.collection('users').doc(userData.regNo.toUpperCase());
      docRef.get().then(function(doc) {
        if (doc.exists) { d.reject('Registration number already exists.'); return; }
        return docRef.set({
          name: userData.name,
          regNo: userData.regNo.toUpperCase(),
          faculty: userData.faculty,
          branch: userData.branch,
          semester: userData.semester,
          role: userData.role || 'student',
          password: userData.password,
          createdAt: new Date().toISOString()
        });
      }).then(function() { d.resolve(); })
        .catch(function(e) { d.reject(e.message || 'Registration failed.'); });
      return d.promise;
    },

    login: function(regNo, password) {
      var d = $q.defer();
      db.collection('users').doc(regNo.toUpperCase()).get()
        .then(function(doc) {
          if (!doc.exists || doc.data().password !== password) {
            d.reject('Invalid registration number or password.'); return;
          }
          var u = doc.data(); u.id = doc.id; d.resolve(u);
        }).catch(function(e) { d.reject(e.message || 'Login failed.'); });
      return d.promise;
    },

    // ── ADMIN: USER MANAGEMENT ────────────────────────────
    getAllUsers: function() {
      return wrap(db.collection('users').orderBy('createdAt', 'desc').get().then(function(snap) {
        return snap.docs.map(function(d) { return d.data(); });
      }));
    },

    updateUserRole: function(regNo, role) {
      return wrap(db.collection('users').doc(regNo).update({ role: role }));
    },

    deleteUser: function(regNo) {
      return wrap(db.collection('users').doc(regNo).delete());
    },

    // ── FACULTY: SYLLABUS MANAGEMENT ─────────────────────
    getSyllabus: function(subjectId) {
      return wrap(db.collection('syllabus').doc(subjectId).get().then(function(doc) {
        return doc.exists ? doc.data() : null;
      }));
    },

    saveSyllabus: function(subjectId, data) {
      return wrap(db.collection('syllabus').doc(subjectId).set(data, { merge: true }));
    },

    // ── FACULTY: PRACTICAL MANAGEMENT ────────────────────
    getPracticals: function(subjectId) {
      return wrap(db.collection('practicals').doc(subjectId).get().then(function(doc) {
        return doc.exists ? doc.data().list || [] : [];
      }));
    },

    savePracticals: function(subjectId, list) {
      return wrap(db.collection('practicals').doc(subjectId).set({ list: list }));
    },

    // ── FACULTY: UPLOAD PERMISSION ────────────────────────
    getUploadSettings: function(subjectId) {
      return wrap(db.collection('settings').doc(subjectId).get().then(function(doc) {
        return doc.exists ? doc.data() : { uploadAllowed: false };
      }));
    },

    setUploadAllowed: function(subjectId, allowed) {
      return wrap(db.collection('settings').doc(subjectId).set({ uploadAllowed: allowed }, { merge: true }));
    },

    // ── STUDENT: LAB MANUAL UPLOAD ────────────────────────
    submitLabManual: function(subjectId, regNo, data) {
      var docId = subjectId + '_' + regNo;
      return wrap(db.collection('labManuals').doc(docId).set({
        subjectId: subjectId,
        regNo: regNo,
        fileName: data.fileName,
        fileUrl: data.fileUrl || '',
        notes: data.notes || '',
        submittedAt: new Date().toISOString()
      }));
    },

    getLabManuals: function(subjectId) {
      return wrap(db.collection('labManuals').where('subjectId', '==', subjectId).get().then(function(snap) {
        return snap.docs.map(function(d) { return d.data(); });
      }));
    },

    getMyLabManual: function(subjectId, regNo) {
      return wrap(db.collection('labManuals').doc(subjectId + '_' + regNo).get().then(function(doc) {
        return doc.exists ? doc.data() : null;
      }));
    }
  };
}]);
