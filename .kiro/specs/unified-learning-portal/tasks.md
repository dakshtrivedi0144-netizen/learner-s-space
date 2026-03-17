# Implementation Plan: Unified Learning Portal

## Overview

Implement the Unified Learning Management Portal as an AngularJS 1.x SPA, building incrementally from the project skeleton through routing, each feature component, and finally wiring everything together.

## Tasks

- [ ] 1. Project skeleton and static assets
  - Create `index.html` with `ng-app="learningPortalApp"`, CDN links for AngularJS 1.x and `angular-route`, `ng-view` outlet, and nav links
  - Create `css/style.css` with base styles and `.ng-invalid` field highlight rules
  - Create `data/textbooks.json` with at least 3 sample textbook objects (`title`, `author`)
  - Create `app.js` declaring the `learningPortalApp` module with `ngRoute` dependency (route config stubbed)
  - _Requirements: 6.1, 6.2, 4.5_

- [ ] 2. SPA routing configuration
  - [ ] 2.1 Configure `$routeProvider` in `app.js` with `/overview`, `/practicals`, `/references` routes and `.otherwise` redirect to `/overview`
    - Wire each route to its `templateUrl` and `controller` as specified in the design
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
  - [ ]* 2.2 Write unit tests for route configuration
    - Test that `/overview`, `/practicals`, and `/references` routes are defined with correct `templateUrl` and `controller`
    - Test that an undefined route redirects to `/overview`
    - _Requirements: 4.1, 4.4_

- [ ] 3. Data Service
  - [ ] 3.1 Implement `services/dataService.js` — `DataService` using `$http` and `$q`
    - Implement `getTextbooks()` returning a `$q` deferred promise that resolves with `res.data` on success and rejects on failure
    - Register service on `learningPortalApp` with DI array notation
    - _Requirements: 5.1, 5.2, 5.6, 6.3_
  - [ ]* 3.2 Write unit tests for DataService (`tests/unit/dataService.spec.js`)
    - Mock `$http` with `$httpBackend`; test resolve path returns textbook array
    - Test reject path sets rejection reason
    - _Requirements: 5.1, 5.2, 5.4_
  - [ ]* 3.3 Write property test P10: Data_Service resolves with textbook data (`tests/property/dataService.prop.spec.js`)
    - **Property 10: Data_Service resolves with textbook data**
    - **Validates: Requirements 5.2, 5.3**
  - [ ]* 3.4 Write property test P11: Data_Service rejects on HTTP failure (`tests/property/dataService.prop.spec.js`)
    - **Property 11: Data_Service rejects on HTTP failure**
    - **Validates: Requirements 5.4**

- [ ] 4. References controller and view
  - [ ] 4.1 Implement `controllers/referencesCtrl.js` — `ReferencesCtrl`
    - Inject `DataService`; set `$scope.loading = true` before fetch
    - On resolve: assign `$scope.textbooks`, set `$scope.loading = false`
    - On reject: set `$scope.error = 'Failed to load textbooks.'`, set `$scope.loading = false`
    - _Requirements: 5.3, 5.4, 5.5, 6.3_
  - [ ] 4.2 Create `views/references.html`
    - Show loading indicator while `loading` is true
    - Render each textbook's `title` and `author` with `ng-repeat` when data is available
    - Show error message when `error` is set
    - _Requirements: 5.3, 5.4, 5.5_
  - [ ]* 4.3 Write unit tests for ReferencesCtrl (`tests/unit/referencesCtrl.spec.js`)
    - Test `$scope.loading` transitions on resolve and reject
    - Test `$scope.error` is set on rejection
    - _Requirements: 5.4, 5.5_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Module Explorer controller and view
  - [ ] 6.1 Implement `controllers/moduleCtrl.js` — `ModuleCtrl`
    - Populate `$scope.syllabus` with at least 2 `SyllabusUnit` objects (id, title, hours, topics array)
    - Expose `$scope.searchTerm = ''` and `$scope.sortField = 'hours'`
    - _Requirements: 1.1, 1.3, 1.5, 6.2_
  - [ ] 6.2 Create `views/overview.html` Module_Explorer section
    - Search input bound via `ng-model="searchTerm"`
    - `ng-repeat` over `syllabus | orderBy:sortField`; render `unit.title | lowercase`
    - Inner `ng-repeat` over `unit.topics | filter:searchTerm`
    - `ng-if` "No results found" when filtered topics length is 0
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - [ ]* 6.3 Write property test P1: Filter soundness (`tests/property/moduleExplorer.prop.spec.js`)
    - **Property 1: Filter soundness**
    - **Validates: Requirements 1.2, 1.6**
  - [ ]* 6.4 Write property test P2: Lowercase display (`tests/property/moduleExplorer.prop.spec.js`)
    - **Property 2: Lowercase display**
    - **Validates: Requirements 1.4**
  - [ ]* 6.5 Write property test P3: Sort by hours (`tests/property/moduleExplorer.prop.spec.js`)
    - **Property 3: Sort by hours**
    - **Validates: Requirements 1.5**

- [ ] 7. Status_Card directive
  - [ ] 7.1 Implement `directives/statusCard.js` — `statusCard` custom element directive
    - `restrict: 'E'`, isolate scope with `practical` (two-way `=`) and `onToggle` (expression `&`)
    - Inline template showing `practical.title`, completed/pending status, toggle button with `ng-click="onToggle()"`, and notes input with `ng-model="practical.notes"` and `ng-keyup`
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 6.4_
  - [ ]* 7.2 Write unit tests for statusCard directive (`tests/unit/statusCard.directive.spec.js`)
    - Compile directive with a known practical object; verify DOM contains title, status text, and notes
    - _Requirements: 2.3_
  - [ ]* 7.3 Write property test P4: Status_Card renders all practical fields (`tests/property/labTracker.prop.spec.js`)
    - **Property 4: Status_Card renders all practical fields**
    - **Validates: Requirements 2.3**

- [ ] 8. Lab Tracker controller and view
  - [ ] 8.1 Implement `controllers/labCtrl.js` — `LabCtrl`
    - Populate `$scope.practicals` with 30 `Practical` objects (id 1–30, title, `completed: false`, `notes: ''`)
    - Implement `$scope.toggleComplete(practical)` that flips `practical.completed`
    - Implement `$scope.completedCount` as a computed value (use `$scope.$watch` or a getter function) equal to the count of practicals where `completed === true`
    - _Requirements: 2.1, 2.4, 2.6, 2.7, 6.3_
  - [ ] 8.2 Create `views/practicals.html`
    - `ng-repeat` over `practicals`, rendering `<status-card>` for each with `practical="p"` and `on-toggle="toggleComplete(p)"`
    - Display summary: `Completed: {{ completedCount }} / 30`
    - _Requirements: 2.1, 2.2, 2.6_
  - [ ]* 8.3 Write unit tests for LabCtrl (`tests/unit/labCtrl.spec.js`)
    - Test `toggleComplete` flips a known practical's `completed` boolean
    - Test `completedCount` updates after toggle
    - _Requirements: 2.4, 2.6, 2.7_
  - [ ]* 8.4 Write property test P5: Toggle round-trip (`tests/property/labTracker.prop.spec.js`)
    - **Property 5: Toggle flips completion status**
    - **Validates: Requirements 2.4, 2.7**
  - [ ]* 8.5 Write property test P6: Notes update reflects in model (`tests/property/labTracker.prop.spec.js`)
    - **Property 6: Notes update reflects in model**
    - **Validates: Requirements 2.5**
  - [ ]* 8.6 Write property test P7: Completed count invariant (`tests/property/labTracker.prop.spec.js`)
    - **Property 7: Completed count invariant**
    - **Validates: Requirements 2.6, 2.7**

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Dashboard parent controller and Submission Engine
  - [ ] 10.1 Implement `controllers/dashboardCtrl.js` — `DashboardCtrl` parent controller
    - Expose shared scope properties (e.g., `$scope.studentInfo`) that child controllers can inherit
    - _Requirements: 3.6, 6.2_
  - [ ] 10.2 Implement `controllers/submissionCtrl.js` — `SubmissionCtrl` child controller
    - Declare as a nested controller inside `overview.html` so it inherits `DashboardCtrl` scope
    - Expose `$scope.submission = { name: '', rollNumber: '', content: '' }`
    - Implement `$scope.submitForm(form)`: on valid submit set `$scope.confirmationMessage`, call `form.$setPristine()`, reset `$scope.submission`
    - _Requirements: 3.1, 3.2, 3.6, 3.7, 6.3_
  - [ ] 10.3 Add Submission_Engine form section to `views/overview.html`
    - Form with `name="submissionForm"` collecting student name, roll number (`ng-pattern="/^\d+$/"`), and content — all `required`
    - Apply `ng-class="{'ng-invalid': field.$invalid && field.$touched}"` on each field
    - Show inline validation messages for empty required fields and non-numeric roll number
    - Submit button disabled when `submissionForm.$pristine || submissionForm.$invalid`
    - Show `confirmationMessage` on successful submit
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8_
  - [ ]* 10.4 Write unit tests for SubmissionCtrl (`tests/unit/submissionCtrl.spec.js`)
    - Test `submitForm` with valid data: verify `confirmationMessage` is set and form is reset to pristine
    - _Requirements: 3.7_
  - [ ]* 10.5 Write property test P8: Form validation state (`tests/property/submissionEngine.prop.spec.js`)
    - **Property 8: Form validation state**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.8**
  - [ ]* 10.6 Write property test P9: Submit resets form to pristine (`tests/property/submissionEngine.prop.spec.js`)
    - **Property 9: Submit resets form to pristine**
    - **Validates: Requirements 3.7**

- [ ] 11. Wire everything together
  - [ ] 11.1 Include all script files in `index.html` in dependency order
    - `app.js` → `dataService.js` → controllers (dashboard, module, lab, submission, references) → `statusCard.js`
    - _Requirements: 6.1, 6.3_
  - [ ] 11.2 Verify `ng-app`, `ng-view`, and nav links in `index.html` resolve to correct routes
    - Nav links use `href="#/overview"`, `href="#/practicals"`, `href="#/references"`
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** and must run a minimum of 100 iterations each
- Each property test file must include the comment tag: `// Feature: unified-learning-portal, Property N: <property_text>`
- Test runner: Karma + Jasmine for unit tests; Jest (or Karma + fast-check) for property tests
- All controllers and services must use DI array notation (e.g., `['$scope', 'DataService', function(...) {}]`) for minification safety
