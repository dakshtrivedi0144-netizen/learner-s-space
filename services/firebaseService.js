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

    // Register new user
    register: function(userData) {
      var deferred = $q.defer();
      // Check if regNo already exists
      db.collection('users').where('regNo', '==', userData.regNo).get()
        .then(function(snapshot) {
          if (!snapshot.empty) {
            deferred.reject('Registration number already exists.');
            return;
          }
          return db.collection('users').add({
            name: userData.name,
            regNo: userData.regNo,
            faculty: userData.faculty,
            branch: userData.branch,
            semester: userData.semester,
            field: userData.field || '',
            password: userData.password,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(function(docRef) {
          if (docRef) deferred.resolve(docRef);
        })
        .catch(function(err) {
          deferred.reject(err.message || 'Registration failed.');
        });
      return deferred.promise;
    },

    // Login user
    login: function(regNo, password) {
      var deferred = $q.defer();
      db.collection('users')
        .where('regNo', '==', regNo)
        .where('password', '==', password)
        .get()
        .then(function(snapshot) {
          if (snapshot.empty) {
            deferred.reject('Invalid registration number or password.');
          } else {
            var user = snapshot.docs[0].data();
            user.id = snapshot.docs[0].id;
            deferred.resolve(user);
          }
        })
        .catch(function(err) {
          deferred.reject(err.message || 'Login failed.');
        });
      return deferred.promise;
    }
  };
}]);
