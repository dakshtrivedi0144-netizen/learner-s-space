// Firebase Config
var firebaseConfig = {
  apiKey: "AIzaSyBLj0nCbh_plECf-0nUxKWcjEI_tVj490I",
  authDomain: "learning-portal-502c9.firebaseapp.com",
  projectId: "learning-portal-502c9",
  storageBucket: "learning-portal-502c9.firebasestorage.app",
  messagingSenderId: "106062258413",
  appId: "1:106062258413:web:3b18e038d06372c1f9ece4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

angular.module('learningPortalApp')
.factory('FirebaseService', ['$q', function($q) {

  return {

    // Register new user — use regNo as document ID to prevent duplicates
    register: function(userData) {
      var deferred = $q.defer();
      var docRef = db.collection('users').doc(userData.regNo.toUpperCase());
      docRef.get().then(function(doc) {
        if (doc.exists) {
          deferred.reject('Registration number already exists.');
          return;
        }
        return docRef.set({
          name: userData.name,
          regNo: userData.regNo.toUpperCase(),
          faculty: userData.faculty,
          branch: userData.branch,
          semester: userData.semester,
          field: userData.field || '',
          password: userData.password,
          createdAt: new Date().toISOString()
        });
      }).then(function() {
        deferred.resolve();
      }).catch(function(err) {
        if (err && err.code === 'permission-denied') {
          deferred.reject('Database permission denied. Please contact admin.');
        } else {
          deferred.reject(err.message || 'Registration failed. Check your connection.');
        }
      });
      return deferred.promise;
    },

    // Login user — fetch by regNo doc ID directly (fast single read)
    login: function(regNo, password) {
      var deferred = $q.defer();
      db.collection('users').doc(regNo.toUpperCase()).get()
        .then(function(doc) {
          if (!doc.exists) {
            deferred.reject('Invalid registration number or password.');
            return;
          }
          var user = doc.data();
          if (user.password !== password) {
            deferred.reject('Invalid registration number or password.');
            return;
          }
          user.id = doc.id;
          deferred.resolve(user);
        })
        .catch(function(err) {
          if (err && err.code === 'permission-denied') {
            deferred.reject('Database permission denied. Please contact admin.');
          } else {
            deferred.reject(err.message || 'Login failed. Check your connection.');
          }
        });
      return deferred.promise;
    }
  };
}]);
