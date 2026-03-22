angular.module('learningPortalApp')
.controller('CCLabCtrl', ['$scope', '$location', '$interval', 'FirebaseService', function($scope, $location, $interval, FirebaseService) {

  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  var SUBJECT_ID   = 'cloud-computing';
  var PROGRESS_KEY = 'ulp_progress_' + SUBJECT_ID;
  var timerIntervals = {};

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveProgress() {
    var data = {};
    $scope.practicals.forEach(function(p) { data[p.id] = { completed: p.completed, notes: p.notes }; });
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  }

  function buildList(source) {
    var progress = loadProgress();
    FirebaseService.getBookmarks(user.regNo).then(function(bookmarks) {
      FirebaseService.getTimers(user.regNo).then(function(timers) {
        $scope.practicals = source.map(function(p, i) {
          var id = i + 1, s = progress[id] || {};
          var bmId = SUBJECT_ID + '_' + id;
          return {
            id: id, title: p.title, aim: p.aim, code: p.code,
            completed: s.completed || false, notes: s.notes || '', showCode: false,
            bookmarked: !!(bookmarks || []).find(function(b) { return b.id === bmId; }),
            timerSeconds: timers[bmId] || 0, timerRunning: false
          };
        });
      });
    });
  }

  FirebaseService.getPracticals(SUBJECT_ID).then(function(list) {
    buildList(list && list.length ? list : []);
  });

  $scope.toggleComplete = function(p) { p.completed = !p.completed; saveProgress(); };
  $scope.toggleCode     = function(p) { p.showCode = !p.showCode; };
  $scope.saveNotes      = function()  { saveProgress(); };
  $scope.completedCount = function()  {
    return ($scope.practicals || []).filter(function(p) { return p.completed; }).length;
  };

  $scope.toggleBookmark = function(p) {
    var bmId = SUBJECT_ID + '_' + p.id;
    FirebaseService.toggleBookmark(user.regNo, { id: bmId, title: p.title, subject: SUBJECT_ID, practicalId: p.id }).then(function(added) {
      p.bookmarked = added;
    });
  };

  $scope.toggleTimer = function(p) {
    var bmId = SUBJECT_ID + '_' + p.id;
    if (p.timerRunning) {
      $interval.cancel(timerIntervals[p.id]);
      timerIntervals[p.id] = null;
      p.timerRunning = false;
      FirebaseService.saveTimer(user.regNo, bmId, p.timerSeconds);
    } else {
      p.timerRunning = true;
      timerIntervals[p.id] = $interval(function() {
        p.timerSeconds++;
      }, 1000);
    }
  };

  $scope.resetTimer = function(p) {
    var bmId = SUBJECT_ID + '_' + p.id;
    if (timerIntervals[p.id]) { $interval.cancel(timerIntervals[p.id]); timerIntervals[p.id] = null; }
    p.timerRunning = false;
    p.timerSeconds = 0;
    FirebaseService.saveTimer(user.regNo, bmId, 0);
  };

  $scope.formatTime = function(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h > 0 ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  };

  $scope.$on('$destroy', function() {
    Object.values(timerIntervals).forEach(function(t) { if (t) $interval.cancel(t); });
  });
}]);
