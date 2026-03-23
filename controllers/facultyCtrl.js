angular.module('learningPortalApp')
.controller('FacultyCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    $location.path('/home'); return;
  }

  var ALL_SUBJECTS = [
    { id: 'angularjs',       name: 'AngularJS',        icon: '🅰️' },
    { id: 'cloud-computing', name: 'Cloud Computing',  icon: '☁️' },
    { id: 'dm-dw',           name: 'Data Mining & DW', icon: '⛏️' }
  ];

  $scope.subjects           = [];
  $scope.selected           = {};
  $scope.tab                = 'practicals';
  $scope.editPracticals     = [];
  $scope.uploadAllowed      = false;
  $scope.deadline           = '';
  $scope.submissions        = [];
  $scope.saving             = false;
  $scope.saveMsg            = '';
  $scope.loadingSubjects    = true;
  $scope.loadingSubmissions = false;
  $scope.theoryUnits        = [];
  $scope.notifications      = [];
  $scope.unreadCount        = 0;
  $scope.studentProgress    = [];
  $scope.announcements      = [];

  // Load subjects
  if (user.role === 'admin') {
    $scope.subjects = ALL_SUBJECTS;
    $scope.loadingSubjects = false;
  } else {
    FirebaseService.getFacultySubjects(user.regNo).then(function(assigned) {
      $scope.loadingSubjects = false;
      $scope.subjects = !assigned || !assigned.length ? [] :
        ALL_SUBJECTS.filter(function(s) { return assigned.indexOf(s.id) !== -1; });
    });
  }

  // Load notifications on init
  loadNotifications();

  // Load announcements
  FirebaseService.getAnnouncements().then(function(list) {
    $scope.announcements = list;
  });

  function loadNotifications() {
    FirebaseService.getNotifications().then(function(list) {
      $scope.notifications = list;
      $scope.unreadCount = list.filter(function(n) { return n.readBy.indexOf(user.regNo) === -1; }).length;
    });
  }

  $scope.selectSubject = function(s) {
    $scope.selected = s;
    $scope.tab = 'practicals';
    $scope.saveMsg = '';
    loadPracticals(s.id);
    loadUploadSetting(s.id);
    loadTheory(s.id);
  };

  function loadPracticals(subjectId) {
    FirebaseService.getPracticals(subjectId).then(function(list) {
      $scope.editPracticals = list && list.length ? angular.copy(list) : [];
    });
  }

  function loadUploadSetting(subjectId) {
    FirebaseService.getUploadSettings(subjectId).then(function(s) {
      $scope.uploadAllowed = s.uploadAllowed || false;
      $scope.deadline = s.deadline || '';
    });
  }

  function loadTheory(subjectId) {
    FirebaseService.getSyllabus(subjectId).then(function(data) {
      $scope.theoryUnits = data ? data.units || [] : [];
    });
  }

  // Reload submissions whenever tab switches to submissions
  $scope.$watch('tab', function(t) {
    if (t === 'submissions' && $scope.selected.id) {
      $scope.loadingSubmissions = true;
      FirebaseService.getLabManuals($scope.selected.id).then(function(list) {
        $scope.submissions = list;
        $scope.loadingSubmissions = false;
      });
    }
    if (t === 'progress' && $scope.selected.id) {
      $scope.loadStudentProgress();
    }
    if (t === 'notifications') {
      loadNotifications();
    }
  });

  $scope.addPractical = function() {
    $scope.editPracticals.push({ title: '', aim: '', code: '' });
  };

  $scope.removePractical = function(idx) {
    $scope.editPracticals.splice(idx, 1);
  };

  $scope.savePracticals = function() {
    if (!$scope.selected.id) return;
    $scope.saving = true; $scope.saveMsg = '';
    FirebaseService.savePracticals($scope.selected.id, $scope.editPracticals, user.regNo).then(function() {
      $scope.saving = false;
      $scope.saveMsg = 'Practicals saved successfully!';
      setTimeout(function() { $scope.$apply(function() { $scope.saveMsg = ''; }); }, 3000);
    }).catch(function(err) { $scope.saving = false; $scope.saveMsg = 'Error: ' + err; });
  };

  $scope.toggleUpload = function() {
    FirebaseService.setUploadAllowed($scope.selected.id, $scope.uploadAllowed, $scope.deadline);
  };

  $scope.saveDeadline = function() {
    FirebaseService.setUploadAllowed($scope.selected.id, $scope.uploadAllowed, $scope.deadline).then(function() {
      $scope.saveMsg = 'Deadline saved!';
      setTimeout(function() { $scope.$apply(function() { $scope.saveMsg = ''; }); }, 2000);
    });
  };

  // Student progress per subject
  $scope.studentProgress = [];
  $scope.loadStudentProgress = function() {
    if (!$scope.selected.id) return;
    FirebaseService.getAllStudentProgress($scope.selected.id).then(function(list) {
      $scope.studentProgress = list;
    });
  };

  // Notifications
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
}]);
