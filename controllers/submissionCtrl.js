angular.module('learningPortalApp')
  .controller('SubmissionCtrl', ['$scope', function($scope) {
    $scope.submission = { name: '', rollNumber: '', content: '' };
    $scope.confirmationMessage = '';

    $scope.submitForm = function(form) {
      if (form.$invalid) return;
      $scope.confirmationMessage = 'Submission received for ' + $scope.submission.name + ' (Roll No: ' + $scope.submission.rollNumber + '). Thank you!';
      $scope.submission = { name: '', rollNumber: '', content: '' };
      form.$setPristine();
      form.$setUntouched();
    };
  }]);
