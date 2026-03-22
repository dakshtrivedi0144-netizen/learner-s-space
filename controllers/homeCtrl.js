angular.module('learningPortalApp')
.controller('HomeCtrl', ['$scope', '$location', 'FirebaseService', function($scope, $location, FirebaseService) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  $scope.user = user;
  $scope.announcements = [];
  $scope.bookmarks = [];

  // Load announcements
  FirebaseService.getAnnouncements().then(function(list) {
    $scope.announcements = list;
  });

  // Load bookmarks
  FirebaseService.getBookmarks(user.regNo).then(function(list) {
    $scope.bookmarks = list;
  });

  // Progress rings per subject
  var subjects = ['angularjs', 'cloud-computing', 'dm-dw'];
  var subjectNames = { 'angularjs':'AngularJS', 'cloud-computing':'Cloud Computing', 'dm-dw':'DM & DW' };
  var subjectIcons = { 'angularjs':'🅰️', 'cloud-computing':'☁️', 'dm-dw':'⛏️' };

  FirebaseService.getAnalytics().then(function(data) {
    $scope.progressRings = subjects.map(function(s) {
      var key = 'ulp_progress_' + s;
      var prog = {};
      try { prog = JSON.parse(localStorage.getItem(key)) || {}; } catch(e) {}
      var done  = Object.values(prog).filter(function(p) { return p.completed; }).length;
      var total = (data.totalPracticals[s] || 1);
      var pct   = Math.round(done / total * 100);
      var circ  = 2 * Math.PI * 36; // r=36
      return {
        id: s, name: subjectNames[s], icon: subjectIcons[s],
        done: done, total: total, pct: pct,
        dash: (pct / 100 * circ).toFixed(1),
        gap:  (circ - pct / 100 * circ).toFixed(1)
      };
    });
  });

  $scope.semesters = [
    { id: 3, label: 'Semester III', desc: 'Data Structures, OOP, Digital Electronics...' },
    { id: 4, label: 'Semester IV', desc: 'DBMS, Computer Networks, OS...' },
    { id: 5, label: 'Semester V', desc: 'Software Engineering, Web Tech, TOC...' },
    { id: 6, label: 'Semester VI', desc: 'Cloud Computing, AngularJS, AI...' },
    { id: 7, label: 'Semester VII', desc: 'Machine Learning, Big Data, IoT...' },
    { id: 8, label: 'Semester VIII', desc: 'Project, Electives, Internship...' }
  ];
}])

.controller('SemesterCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
  var user = JSON.parse(localStorage.getItem('ulp_session') || 'null');
  if (!user) { $location.path('/login'); return; }
  if (user.role === 'admin') { $location.path('/admin'); return; }
  if (user.role === 'faculty') { $location.path('/faculty'); return; }

  var semId = parseInt($routeParams.semId);
  $scope.semId = semId;

  var allSubjects = {
    3: [
      { name: 'Data Structures', code: '23UGCE3XX', credits: 4, icon: '🌲', comingSoon: true },
      { name: 'Object Oriented Programming', code: '23UGCE3XX', credits: 4, icon: '🧩', comingSoon: true },
      { name: 'Digital Electronics', code: '23UGCE3XX', credits: 4, icon: '⚡', comingSoon: true },
      { name: 'Discrete Mathematics', code: '23UGCE3XX', credits: 4, icon: '📐', comingSoon: true }
    ],
    4: [
      { name: 'Database Management System', code: '23UGCE4XX', credits: 4, icon: '🗄️', comingSoon: true },
      { name: 'Computer Networks', code: '23UGCE4XX', credits: 4, icon: '🌐', comingSoon: true },
      { name: 'Operating Systems', code: '23UGCE4XX', credits: 4, icon: '💻', comingSoon: true },
      { name: 'Microprocessors', code: '23UGCE4XX', credits: 4, icon: '🔧', comingSoon: true }
    ],
    5: [
      { name: 'Software Engineering', code: '23UGCE5XX', credits: 4, icon: '🛠️', comingSoon: true },
      { name: 'Web Technologies', code: '23UGCE5XX', credits: 4, icon: '🌍', comingSoon: true },
      { name: 'Theory of Computation', code: '23UGCE5XX', credits: 4, icon: '🔣', comingSoon: true },
      { name: 'Computer Graphics', code: '23UGCE5XX', credits: 4, icon: '🎨', comingSoon: true }
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
      { name: 'Machine Learning', code: '23UGCE7XX', credits: 4, icon: '🧠', comingSoon: true },
      { name: 'Big Data Analytics', code: '23UGCE7XX', credits: 4, icon: '📊', comingSoon: true },
      { name: 'Internet of Things', code: '23UGCE7XX', credits: 4, icon: '📡', comingSoon: true },
      { name: 'Mobile Application Development', code: '23UGCE7XX', credits: 4, icon: '📱', comingSoon: true }
    ],
    8: [
      { name: 'Project Work', code: '23UGCE8XX', credits: 8, icon: '🚀', comingSoon: true },
      { name: 'Elective I', code: '23UGCE8XX', credits: 4, icon: '📚', comingSoon: true },
      { name: 'Elective II', code: '23UGCE8XX', credits: 4, icon: '📖', comingSoon: true },
      { name: 'Internship', code: '23UGCE8XX', credits: 4, icon: '🏢', comingSoon: true }
    ]
  };

  $scope.subjects = allSubjects[semId] || [];
  $scope.semLabel = 'Semester ' + (semId === 3 ? 'III' : semId === 4 ? 'IV' : semId === 5 ? 'V' : semId === 6 ? 'VI' : semId === 7 ? 'VII' : 'VIII');
}]);
