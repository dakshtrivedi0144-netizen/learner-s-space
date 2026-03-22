angular.module('learningPortalApp')
.controller('FacultyCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    $location.path('/home'); return;
  }

  $scope.subjects = [
    { id: 'angularjs', name: 'AngularJS', icon: '🅰️' },
    { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️' },
    { id: 'dm-dw', name: 'Data Mining & DW', icon: '⛏️' }
  ];

  $scope.selected = {};
  $scope.tab = 'practicals';
  $scope.editPracticals = [];
  $scope.uploadAllowed = false;
  $scope.submissions = [];
  $scope.saving = false;
  $scope.saveMsg = '';
  $scope.loadingSubmissions = false;

  $scope.selectSubject = function(s) {
    $scope.selected = s;
    $scope.tab = 'practicals';
    $scope.saveMsg = '';
    loadPracticals(s.id);
    loadUploadSetting(s.id);
  };

  function loadPracticals(subjectId) {
    FirebaseService.getPracticals(subjectId).then(function(list) {
      $scope.editPracticals = list.length ? angular.copy(list) : [];
    });
  }

  function loadUploadSetting(subjectId) {
    FirebaseService.getUploadSettings(subjectId).then(function(settings) {
      $scope.uploadAllowed = settings.uploadAllowed || false;
    });
  }

  $scope.$watch('tab', function(t) {
    if (t === 'submissions' && $scope.selected.id) {
      $scope.loadingSubmissions = true;
      FirebaseService.getLabManuals($scope.selected.id).then(function(list) {
        $scope.submissions = list;
        $scope.loadingSubmissions = false;
      });
    }
  });

  $scope.addPractical = function() {
    $scope.editPracticals.push({ title: '', aim: '', code: '' });
  };

  $scope.removePractical = function(idx) {
    $scope.editPracticals.splice(idx, 1);
  };

  $scope.savePracticals = function() {
    $scope.saving = true;
    $scope.saveMsg = '';
    FirebaseService.savePracticals($scope.selected.id, $scope.editPracticals).then(function() {
      $scope.saving = false;
      $scope.saveMsg = 'Practicals saved successfully!';
      setTimeout(function() { $scope.$apply(function() { $scope.saveMsg = ''; }); }, 3000);
    }).catch(function(err) {
      $scope.saving = false;
      $scope.saveMsg = 'Error: ' + err;
    });
  };

  $scope.toggleUpload = function() {
    FirebaseService.setUploadAllowed($scope.selected.id, $scope.uploadAllowed);
  };
}]);
