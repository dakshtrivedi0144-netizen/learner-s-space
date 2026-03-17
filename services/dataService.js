angular.module('learningPortalApp')
  .service('DataService', ['$http', '$q', function($http, $q) {
    this.getTextbooks = function() {
      var deferred = $q.defer();
      $http.get('data/textbooks.json')
        .then(function(res)  { deferred.resolve(res.data); })
        .catch(function(err) { deferred.reject(err); });
      return deferred.promise;
    };
  }]);
