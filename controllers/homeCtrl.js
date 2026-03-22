angular.module('learningPortalApp')
.controller('HomeCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  $scope.user = user;
  $scope.announcements = [];
  $scope.bookmarks = [];

  var userSem = parseInt(user.semester) || 6;

  // Auto-redirect to student's semester on first load
  $location.path('/semester/' + userSem);
  return;
}])

.controller('SemesterCtrl', ['$scope', '$routeParams', '$location', 'FirebaseService', function($scope, $routeParams, $location, FirebaseService) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  var semId = parseInt($routeParams.semId);
  var userSem = parseInt(user.semester) || 6;
  $scope.semId = semId;
  $scope.user = user;
  $scope.isUserSem = (semId === userSem);

  // Load announcements for this semester page
  FirebaseService.getAnnouncements().then(function(list) {
    $scope.announcements = list;
  });

  // Load bookmarks
  FirebaseService.getBookmarks(user.regNo).then(function(list) {
    $scope.bookmarks = list;
  });

  // Progress rings — only for sem 6 (where content exists)
  if (semId === 6) {
    var subjects6 = ['angularjs', 'cloud-computing', 'dm-dw'];
    var subjectNames6 = { 'angularjs':'AngularJS', 'cloud-computing':'Cloud Computing', 'dm-dw':'DM & DW' };
    var subjectIcons6 = { 'angularjs':'🅰️', 'cloud-computing':'☁️', 'dm-dw':'⛏️' };
    FirebaseService.getAnalytics().then(function(data) {
      $scope.progressRings = subjects6.map(function(s) {
        var key = 'ulp_progress_' + s;
        var prog = {};
        try { prog = JSON.parse(localStorage.getItem(key)) || {}; } catch(e) {}
        var done  = Object.values(prog).filter(function(p) { return p.completed; }).length;
        var total = data.totalPracticals[s] || 1;
        var pct   = Math.round(done / total * 100);
        var circ  = 2 * Math.PI * 36;
        return {
          id: s, name: subjectNames6[s], icon: subjectIcons6[s],
          done: done, total: total, pct: pct,
          dash: (pct / 100 * circ).toFixed(1),
          gap:  (circ - pct / 100 * circ).toFixed(1)
        };
      });
    });
  }

  var semLabels = { 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII', 8:'VIII' };

  var allSubjects = {
    3: [
      { name: 'Data Structures', code: '23UGCE301', credits: 4, icon: '🌲', comingSoon: true },
      { name: 'Object Oriented Programming', code: '23UGCE302', credits: 4, icon: '🧩', comingSoon: true },
      { name: 'Digital Electronics', code: '23UGCE303', credits: 4, icon: '⚡', comingSoon: true },
      { name: 'Discrete Mathematics', code: '23UGCE304', credits: 4, icon: '📐', comingSoon: true }
    ],
    4: [
      { name: 'Database Management System', code: '23UGCE401', credits: 4, icon: '🗄️', comingSoon: true },
      { name: 'Computer Networks', code: '23UGCE402', credits: 4, icon: '🌐', comingSoon: true },
      { name: 'Operating Systems', code: '23UGCE403', credits: 4, icon: '💻', comingSoon: true },
      { name: 'Microprocessors', code: '23UGCE404', credits: 4, icon: '🔧', comingSoon: true }
    ],
    5: [
      { name: 'Software Engineering', code: '23UGCE501', credits: 4, icon: '🛠️', comingSoon: true },
      { name: 'Web Technologies', code: '23UGCE502', credits: 4, icon: '🌍', comingSoon: true },
      { name: 'Theory of Computation', code: '23UGCE503', credits: 4, icon: '🔣', comingSoon: true },
      { name: 'Computer Graphics', code: '23UGCE504', credits: 4, icon: '🎨', comingSoon: true }
    ],
    6: [
      { name: 'AngularJS', code: '23UGCE6XX', credits: 4, icon: '🅰️',
        links: { syllabus: '#!/overview', lab: '#!/practicals', references: '#!/references' } },
      { name: 'Cloud Computing', code: '23UGCE610', credits: 4, icon: '☁️',
        links: { syllabus: '#!/cc-overview', lab: '#!/cc-practicals' } },
      { name: 'Data Mining & Data Warehousing', code: '23UGCE602', credits: 4, icon: '⛏️',
        links: { syllabus: '#!/dm-overview', lab: '#!/dm-practicals' } },
      { name: 'Information Security', code: '23UGCE6XX', credits: 4, icon: '🔒', comingSoon: true }
    ],
    7: [
      { name: 'Machine Learning', code: '23UGCE701', credits: 4, icon: '🧠', comingSoon: true },
      { name: 'Big Data Analytics', code: '23UGCE702', credits: 4, icon: '📊', comingSoon: true },
      { name: 'Internet of Things', code: '23UGCE703', credits: 4, icon: '📡', comingSoon: true },
      { name: 'Mobile Application Development', code: '23UGCE704', credits: 4, icon: '📱', comingSoon: true }
    ],
    8: [
      { name: 'Project Work', code: '23UGCE801', credits: 8, icon: '🚀', comingSoon: true },
      { name: 'Elective I', code: '23UGCE802', credits: 4, icon: '📚', comingSoon: true },
      { name: 'Elective II', code: '23UGCE803', credits: 4, icon: '📖', comingSoon: true },
      { name: 'Internship', code: '23UGCE804', credits: 4, icon: '🏢', comingSoon: true }
    ]
  };

  $scope.subjects = allSubjects[semId] || [];
  $scope.semLabel = 'Semester ' + (semLabels[semId] || semId);
  $scope.userSemLabel = 'Semester ' + (semLabels[userSem] || userSem);

  // All semesters for the switcher
  $scope.allSems = [3, 4, 5, 6, 7, 8];
  $scope.goToSem = function(s) { $location.path('/semester/' + s); };
}]);
