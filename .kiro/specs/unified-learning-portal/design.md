# Design Document: Unified Learning Portal

## Overview

The Unified Learning Management Portal is an AngularJS 1.x Single Page Application (SPA) that serves as a centralized dashboard for a BTech Computer Engineering course. It provides four primary functional areas — module content exploration, practical lab tracking, submission validation, and external data fetching — all wired together through client-side routing and a shared AngularJS module.

The application runs entirely in the browser. There is no server-side rendering. All state lives in AngularJS `$scope` and services for the duration of the session. External data (textbook list) is fetched via `$http` from a JSON endpoint.

Key design goals:
- Demonstrate core AngularJS 1.x concepts: two-way binding, directives, form validation, `$routeProvider`, `$http`/`$q`, and Dependency Injection.
- Keep the structure simple and teachable — one module, a small set of controllers, one custom directive, and one service.
- Avoid any framework beyond AngularJS 1.x and `angular-route`.

---

## Architecture

The application follows the AngularJS MVC pattern:

- **Model** — plain JavaScript objects held on `$scope` or inside services.
- **View** — HTML templates with AngularJS directives and expressions.
- **Controller** — `$scope`-populating functions registered on the main `app` module.

```
index.html  (ng-app="learningPortalApp", ng-view outlet)
│
├── app.js              — module declaration, $routeProvider config
├── services/
│   └── dataService.js  — Data_Service ($http + $q)
├── controllers/
│   ├── dashboardCtrl.js    — parent Dashboard controller
│   ├── moduleCtrl.js       — Module_Explorer controller (child of dashboard)
│   ├── labCtrl.js          — Lab_Tracker controller
│   ├── submissionCtrl.js   — Submission_Engine controller (child of dashboard)
│   └── referencesCtrl.js   — References controller
├── directives/
│   └── statusCard.js       — Status_Card custom element directive
└── views/
    ├── overview.html       — Course Overview (Module_Explorer + Submission_Engine)
    ├── practicals.html     — Practicals (Lab_Tracker)
    └── references.html     — References (textbook list)
```

### Routing

```
$routeProvider
  .when('/overview',    { templateUrl: 'views/overview.html',    controller: 'DashboardCtrl' })
  .when('/practicals',  { templateUrl: 'views/practicals.html',  controller: 'LabCtrl' })
  .when('/references',  { templateUrl: 'views/references.html',  controller: 'ReferencesCtrl' })
  .otherwise({ redirectTo: '/overview' });
```

### Digest Cycle Flow

```
User interaction (ng-click / ng-keyup / ng-model change)
  → AngularJS $scope mutation
    → $digest cycle triggered
      → dirty-checking watchers
        → DOM updated via data binding
```

---

## Components and Interfaces

### 1. Module_Explorer (moduleCtrl + overview.html partial)

Responsibilities:
- Expose `syllabus` array on `$scope` (array of `SyllabusUnit` objects).
- Expose `searchTerm` string bound via `ng-model` to the search input.
- Expose `sortField` string (`'hours'`) used by `orderBy`.
- Filter displayed topics client-side using AngularJS's built-in `filter` and `orderBy` pipes in the template.
- Show "No results found" when the filtered list is empty.

Template bindings:
```html
<input ng-model="searchTerm" placeholder="Search topics…">
<div ng-repeat="unit in syllabus | orderBy:sortField">
  <h3>{{ unit.title | lowercase }}</h3>
  <ul>
    <li ng-repeat="topic in unit.topics | filter:searchTerm">{{ topic }}</li>
  </ul>
  <p ng-if="(unit.topics | filter:searchTerm).length === 0">No results found</p>
</div>
```

### 2. Lab_Tracker (labCtrl + practicals.html)

Responsibilities:
- Expose `practicals` array of 30 `Practical` objects on `$scope`.
- Expose `completedCount` computed property (count of practicals where `completed === true`).
- Handle `toggleComplete(practical)` via `ng-click`.
- Handle `updateNotes(practical, $event)` via `ng-keyup`.

Uses the `statusCard` custom element directive for each practical:
```html
<div ng-repeat="p in practicals">
  <status-card practical="p" on-toggle="toggleComplete(p)"></status-card>
</div>
<p>Completed: {{ completedCount }} / 30</p>
```

### 3. Status_Card Directive (statusCard.js)

Type: custom element directive (`restrict: 'E'`).

Isolate scope bindings:
- `practical` — two-way (`=`) bound `Practical` object.
- `onToggle` — expression (`&`) callback for completion toggle.

Template (inline or `templateUrl`):
```html
<div class="status-card">
  <h4>{{ practical.title }}</h4>
  <span>{{ practical.completed ? 'Done' : 'Pending' }}</span>
  <button ng-click="onToggle()">Toggle</button>
  <input ng-model="practical.notes" ng-keyup="practical.notes = $event.target.value">
</div>
```

### 4. Submission_Engine (submissionCtrl + overview.html partial)

Responsibilities:
- Child controller of `DashboardCtrl`; inherits parent `$scope`.
- Expose `submission` model: `{ name, rollNumber, content }`.
- Expose `submitForm(form)` handler.
- On valid submit: set `$scope.confirmationMessage`, call `form.$setPristine()`.

Form state rules enforced in template:
- Submit button disabled when `submissionForm.$pristine || submissionForm.$invalid`.
- `ng-class: { 'ng-invalid': field.$invalid && field.$touched }` on each field.
- Roll number validated with `ng-pattern="/^\d+$/"`.

### 5. Data_Service (dataService.js)

```javascript
angular.module('learningPortalApp')
  .service('DataService', ['$http', '$q', function($http, $q) {
    this.getTextbooks = function() {
      var deferred = $q.defer();
      $http.get('/api/textbooks.json')
        .then(function(res)  { deferred.resolve(res.data); })
        .catch(function(err) { deferred.reject(err); });
      return deferred.promise;
    };
  }]);
```

### 6. References Controller (referencesCtrl.js)

- Injects `DataService`.
- Sets `$scope.loading = true` before fetch.
- On resolve: sets `$scope.textbooks`, `$scope.loading = false`.
- On reject: sets `$scope.error = 'Failed to load textbooks.'`, `$scope.loading = false`.

---

## Data Models

### SyllabusUnit
```javascript
{
  id:     Number,   // e.g. 1, 2
  title:  String,   // e.g. "Unit I: Introduction"
  hours:  Number,   // credit hours
  topics: [String]  // list of topic strings
}
```

### Practical
```javascript
{
  id:        Number,   // 1–30
  title:     String,   // e.g. "Practical 1: Hello World"
  completed: Boolean,  // default false
  notes:     String    // default ""
}
```

### Submission
```javascript
{
  name:       String,  // student full name
  rollNumber: String,  // numeric string, validated by pattern
  content:    String   // submission text
}
```

### Textbook
```javascript
{
  title:  String,  // book title
  author: String   // author name(s)
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Filter soundness

*For any* array of `SyllabusUnit` objects and any search term string, every topic that appears in the filtered result must contain the search term (case-insensitive), and every topic that contains the search term must appear in the filtered result.

**Validates: Requirements 1.2, 1.6**

---

### Property 2: Lowercase display

*For any* `SyllabusUnit` title string, passing it through the `lowercase` filter must produce a string that is strictly equal to `title.toLowerCase()`.

**Validates: Requirements 1.4**

---

### Property 3: Sort by hours

*For any* array of `SyllabusUnit` objects, after applying `orderBy:'hours'`, the resulting array must be sorted in non-decreasing order of the `hours` field, and must contain exactly the same elements as the original array.

**Validates: Requirements 1.5**

---

### Property 4: Status_Card renders all practical fields

*For any* `Practical` object, the HTML rendered by the `statusCard` directive must contain the practical's `title`, a representation of its `completed` status, and its `notes` value.

**Validates: Requirements 2.3**

---

### Property 5: Toggle flips completion status

*For any* `Practical` object, calling `toggleComplete(practical)` must flip `practical.completed` from `false` to `true` or from `true` to `false`, and calling it twice must return the practical to its original state (round-trip).

**Validates: Requirements 2.4, 2.7**

---

### Property 6: Notes update reflects in model

*For any* `Practical` object and any string value typed into the notes field, after the `ng-keyup` handler fires, `practical.notes` must equal the typed string.

**Validates: Requirements 2.5**

---

### Property 7: Completed count invariant

*For any* array of `Practical` objects, `completedCount` must always equal the number of practicals in the array where `completed === true`.

**Validates: Requirements 2.6, 2.7**

---

### Property 8: Form validation state

*For any* `Submission_Form` state, if any required field is empty or the roll number contains non-numeric characters, then the `ng-invalid` CSS class must be present on that field and the submit button must be disabled. Conversely, when all required fields are non-empty and the roll number is purely numeric, no `ng-invalid` classes must be present and the submit button must be enabled.

**Validates: Requirements 3.3, 3.4, 3.5, 3.8**

---

### Property 9: Submit resets form to pristine

*For any* valid `Submission` object, after `submitForm` is called successfully, `submissionForm.$pristine` must be `true` and a non-empty confirmation message must be present on `$scope`.

**Validates: Requirements 3.7**

---

### Property 10: Data_Service resolves with textbook data

*For any* successful `$http` response containing an array of `Textbook` objects, the promise returned by `DataService.getTextbooks()` must resolve with that same array.

**Validates: Requirements 5.2, 5.3**

---

### Property 11: Data_Service rejects on HTTP failure

*For any* failed `$http` response, the promise returned by `DataService.getTextbooks()` must be rejected (not resolved), and the References controller must set a non-empty `$scope.error` string.

**Validates: Requirements 5.4**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `$http` request to textbook endpoint fails (network error, 4xx, 5xx) | `DataService` rejects the `$q` deferred; `ReferencesCtrl` catches rejection, sets `$scope.error`, clears `$scope.loading` |
| `$http` response body is not a valid JSON array | `ReferencesCtrl` treats it as an error and displays the error message |
| Student navigates to an undefined route | `$routeProvider.otherwise` redirects to `/overview` |
| Required form field left empty | AngularJS built-in `required` validator sets `$invalid`; template shows inline message |
| Roll number contains non-numeric characters | `ng-pattern` validator sets field `$invalid`; template shows field-level error |
| Search term produces no matching topics | Template `ng-if` shows "No results found" message; no error thrown |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:
- Unit tests catch concrete bugs with specific inputs and verify integration points.
- Property-based tests verify universal correctness across a wide range of generated inputs.

### Unit Tests

Focus areas:
- `DataService.getTextbooks()` — mock `$http`, verify resolve and reject paths (examples for 5.1, 5.5).
- `ReferencesCtrl` — verify `$scope.loading` transitions and `$scope.error` on rejection.
- `LabCtrl.toggleComplete()` — specific example: toggle a known practical, verify boolean flip.
- `SubmissionCtrl.submitForm()` — specific example: submit valid form, verify confirmation and `$setPristine`.
- Route configuration — verify `/overview`, `/practicals`, `/references` are defined and `.otherwise` redirects to `/overview` (examples for 4.1, 4.2, 4.4).
- `statusCard` directive — render with a known practical object, verify DOM contains expected text.

### Property-Based Tests

Use **[fast-check](https://github.com/dubzzz/fast-check)** (JavaScript property-based testing library).

Each property test must run a minimum of **100 iterations**.

Each test must include a comment tag in the format:
`// Feature: unified-learning-portal, Property N: <property_text>`

| Property | Test Description | Arbitraries |
|---|---|---|
| P1: Filter soundness | Generate random `SyllabusUnit[]` and search term; assert every result contains term (case-insensitive) and no matching topic is excluded | `fc.array(syllabusUnitArb)`, `fc.string()` |
| P2: Lowercase display | Generate random title strings; assert `lowercase(title) === title.toLowerCase()` | `fc.string()` |
| P3: Sort by hours | Generate random `SyllabusUnit[]`; assert sorted array is non-decreasing by `hours` and has same elements | `fc.array(syllabusUnitArb)` |
| P4: Status_Card renders fields | Generate random `Practical`; assert rendered HTML contains `title`, status, and `notes` | `fc.record({ id: fc.nat(), title: fc.string(), completed: fc.boolean(), notes: fc.string() })` |
| P5: Toggle round-trip | Generate random `Practical`; assert double-toggle returns to original `completed` value | `fc.record(...)` |
| P6: Notes update | Generate random `Practical` and string; assert `notes` equals typed string after handler | `fc.record(...)`, `fc.string()` |
| P7: Completed count | Generate random `Practical[]`; assert `completedCount === practicals.filter(p => p.completed).length` | `fc.array(practicalArb)` |
| P8: Form validation state | Generate valid and invalid `Submission` objects; assert `$invalid` / button state matches validity | `fc.record(submissionArb)` |
| P9: Submit resets form | Generate valid `Submission`; assert `$pristine === true` and `confirmationMessage` is non-empty after submit | `fc.record(validSubmissionArb)` |
| P10: Service resolves | Generate random `Textbook[]`; mock `$http` success; assert promise resolves with same array | `fc.array(textbookArb)` |
| P11: Service rejects | Generate random HTTP error codes; mock `$http` failure; assert promise rejects and `$scope.error` is set | `fc.integer({ min: 400, max: 599 })` |

### Test File Layout

```
tests/
├── unit/
│   ├── dataService.spec.js
│   ├── referencesCtrl.spec.js
│   ├── labCtrl.spec.js
│   ├── submissionCtrl.spec.js
│   ├── routeConfig.spec.js
│   └── statusCard.directive.spec.js
└── property/
    ├── moduleExplorer.prop.spec.js   (P1, P2, P3)
    ├── labTracker.prop.spec.js       (P4, P5, P6, P7)
    ├── submissionEngine.prop.spec.js (P8, P9)
    └── dataService.prop.spec.js      (P10, P11)
```

Test runner: **Karma** with **Jasmine** for unit tests; **Jest** (or Karma + fast-check) for property tests.
