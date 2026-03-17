# Requirements Document

## Introduction

The Unified Learning Management Portal is a Single Page Application (SPA) built with AngularJS (Angular 1.x) that serves as a centralized dashboard for managing the theoretical and practical components of a BTech Computer Engineering course. The portal covers module content exploration, practical lab tracking, student submission validation, and SPA navigation with external data fetching — each mapping to a distinct unit of the course syllabus.

## Glossary

- **Portal**: The Unified Learning Management Portal SPA as a whole.
- **Dashboard**: The main landing view of the Portal that aggregates all module summaries.
- **Module_Explorer**: The component responsible for displaying and filtering syllabus units (Unit I & II).
- **Lab_Tracker**: The component responsible for rendering and managing the list of practicals (Unit III).
- **Submission_Engine**: The component responsible for student submission forms and validation (Unit IV).
- **Router**: The AngularJS `$routeProvider`-based navigation layer (Unit V).
- **Data_Service**: The AngularJS service that uses `$http` and `$q` to fetch and resolve external JSON data.
- **Status_Card**: A reusable custom directive that displays the completion status and notes for a single practical.
- **Student**: A BTech Computer Engineering student who uses the Portal.
- **Practical**: One of the 30 lab tasks listed in the course syllabus.
- **Submission_Form**: The form used by a Student to submit assignment or lab data.
- **Syllabus_Unit**: A top-level grouping of course topics (e.g., Unit I, Unit II).

---

## Requirements

### Requirement 1: Module & Content Explorer

**User Story:** As a Student, I want to search and filter syllabus units and topics, so that I can quickly locate relevant course content.

#### Acceptance Criteria

1. THE Module_Explorer SHALL display all Syllabus_Units and their associated topics on the Dashboard.
2. WHEN a Student enters a search term in the search field, THE Module_Explorer SHALL filter the displayed topics to only those whose text contains the search term (case-insensitive).
3. THE Module_Explorer SHALL use two-way data binding via `ng-model` so that the search field and the filtered topic list remain in sync at all times.
4. THE Module_Explorer SHALL display Syllabus_Unit titles in lowercase using the `lowercase` filter.
5. WHEN a Student selects a sort order, THE Module_Explorer SHALL reorder the displayed Syllabus_Units by hours using the `orderBy` filter.
6. IF no topics match the current search term, THEN THE Module_Explorer SHALL display a "No results found" message.

---

### Requirement 2: Practical Lab Tracker

**User Story:** As a Student, I want to view, annotate, and mark practicals as complete, so that I can track my lab progress throughout the course.

#### Acceptance Criteria

1. THE Lab_Tracker SHALL render all 30 Practicals using `ng-repeat`, displaying each Practical's title and current status.
2. THE Lab_Tracker SHALL use a custom element directive to render each Practical as a Status_Card.
3. THE Status_Card SHALL accept a Practical object as an attribute and display its title, completion status, and notes.
4. WHEN a Student clicks the completion toggle on a Status_Card, THE Lab_Tracker SHALL update that Practical's completion status immediately via `ng-click`.
5. WHEN a Student types in the notes field of a Status_Card, THE Lab_Tracker SHALL update that Practical's notes in real time via `ng-keyup`.
6. THE Lab_Tracker SHALL display a summary count of completed Practicals out of 30.
7. IF a Practical's completion status is toggled, THEN THE Lab_Tracker SHALL reflect the updated count in the summary immediately.

---

### Requirement 3: Submission & Validation Engine

**User Story:** As a Student, I want to submit my assignment data through a validated form, so that only complete and correctly formatted submissions are accepted.

#### Acceptance Criteria

1. THE Submission_Engine SHALL present a Submission_Form that collects student name, roll number, and submission content.
2. THE Submission_Engine SHALL track and expose the Submission_Form's state as pristine, dirty, or touched using AngularJS form state properties.
3. WHEN the Submission_Form is in a pristine state, THE Submission_Engine SHALL disable the submit button.
4. WHEN a required field is left empty, THE Submission_Engine SHALL apply the `ng-invalid` CSS class to that field and display an inline validation message.
5. WHEN all required fields contain valid input, THE Submission_Engine SHALL enable the submit button and remove all `ng-invalid` CSS classes.
6. THE Submission_Engine SHALL use a child controller that inherits scope from the parent Dashboard controller to manage Submission_Form data flow.
7. WHEN a Student submits a valid Submission_Form, THE Submission_Engine SHALL display a confirmation message and reset the form to its pristine state.
8. IF the roll number field contains non-numeric characters, THEN THE Submission_Engine SHALL display a field-level validation error message.

---

### Requirement 4: SPA Navigation

**User Story:** As a Student, I want to navigate between the Course Overview, Practicals, and References views without a full page reload, so that the experience feels fast and seamless.

#### Acceptance Criteria

1. THE Router SHALL define routes for at least three views: "Course Overview", "Practicals", and "References".
2. WHEN a Student clicks a navigation link, THE Router SHALL load the corresponding view template and controller without reloading the page.
3. WHILE a view transition is in progress, THE Portal SHALL retain the current URL fragment so that the browser back and forward buttons navigate between views correctly.
4. IF a Student navigates to an undefined route, THEN THE Router SHALL redirect the Student to the "Course Overview" view.
5. THE Router SHALL use AngularJS `$routeProvider` to configure all routes.

---

### Requirement 5: External Data Fetching

**User Story:** As a Student, I want the References view to display the required textbook list fetched from an external source, so that I always see up-to-date reading material.

#### Acceptance Criteria

1. THE Data_Service SHALL fetch the textbook list from an external JSON endpoint using the `$http` service.
2. THE Data_Service SHALL use `$q` to return a promise that resolves with the textbook data on success.
3. WHEN the textbook data is successfully fetched, THE Portal SHALL display each textbook's title and author in the References view.
4. IF the `$http` request fails, THEN THE Data_Service SHALL reject the promise and THE Portal SHALL display a user-readable error message in the References view.
5. WHILE the textbook data is loading, THE Portal SHALL display a loading indicator in the References view.
6. THE Data_Service SHALL be implemented as a reusable AngularJS service injectable into any controller via Dependency Injection.

---

### Requirement 6: General SPA Architecture

**User Story:** As a developer, I want the Portal to follow AngularJS SPA best practices, so that the codebase is maintainable and consistent.

#### Acceptance Criteria

1. THE Portal SHALL be implemented as a Single Page Application using AngularJS 1.x.
2. THE Portal SHALL separate data (models/services), logic (controllers), and presentation (templates) following the MVC pattern.
3. THE Portal SHALL use Dependency Injection for all controllers and services.
4. THE Portal SHALL manage all shared state through AngularJS scope and services, avoiding direct DOM manipulation outside of directives.
5. WHEN the AngularJS Digest Cycle runs, THE Portal SHALL reflect all model changes in the view without requiring manual DOM updates.
