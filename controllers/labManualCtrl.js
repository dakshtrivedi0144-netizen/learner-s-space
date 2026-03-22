angular.module('learningPortalApp')
.controller('LabManualCtrl', ['$scope', '$routeParams', '$location', 'FirebaseService', function($scope, $routeParams, $location, FirebaseService) {

  var SESSION_KEY = 'ulp_session';
  var user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (!user) { $location.path('/login'); return; }

  var subjectId = $routeParams.subjectId;
  var subjectNames = {
    'angularjs': 'AngularJS (23UGCE6XX)',
    'cloud-computing': 'Cloud Computing (23UGCE610)',
    'dm-dw': 'Data Mining & DW (23UGCE602)'
  };

  $scope.subjectName = subjectNames[subjectId] || subjectId;
  $scope.uploadAllowed = false;
  $scope.existing = null;
  $scope.submission = { notes: '', fileUrl: '', fileName: '' };
  $scope.submitting = false;
  $scope.submitError = '';
  $scope.submitSuccess = '';

  $scope.goBack = function() { $location.path('/semester/6'); };

  // Load upload permission
  FirebaseService.getUploadSettings(subjectId).then(function(s) {
    $scope.uploadAllowed = s.uploadAllowed || false;
  });

  // Load existing submission
  FirebaseService.getMyLabManual(subjectId, user.regNo).then(function(data) {
    if (data) {
      $scope.existing = data;
      $scope.submission = { notes: data.notes || '', fileUrl: data.fileUrl || '', fileName: data.fileName || '' };
    }
  });

  $scope.submitManual = function() {
    $scope.submitError = ''; $scope.submitSuccess = '';
    if (!$scope.submission.notes && !$scope.submission.fileUrl) {
      $scope.submitError = 'Please add notes or a file link.'; return;
    }
    $scope.submitting = true;
    FirebaseService.submitLabManual(subjectId, user.regNo, $scope.submission, user.name).then(function() {
      $scope.submitting = false;
      $scope.submitSuccess = 'Lab manual submitted successfully!';
      $scope.existing = { submittedAt: new Date().toISOString(), notes: $scope.submission.notes };
    }).catch(function(err) {
      $scope.submitting = false;
      $scope.submitError = err;
    });
  };
}]);
