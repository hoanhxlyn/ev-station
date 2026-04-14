# Feature Specification: Signup Form Validation Improvements

**Feature Branch**: `003-about-signup-form`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "About signup form. I want the error for things like email existed or username existed should reflect in the form not toast. Also when registering with oauth, it doesn't make sense to fill in password field."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Inline form validation errors (Priority: P1)

Users attempting to register with an email or username that already exists receive clear, inline error messages directly within the registration form rather than as toast notifications.

**Why this priority**: Form validation errors appearing in-context help users understand exactly what went wrong and where, reducing frustration and support inquiries.

**Independent Test**: Can be fully tested by submitting a registration form with an existing email/username and verifying error messages appear next to the relevant fields.

**Acceptance Scenarios**:

1. **Given** a user is on the registration form, **When** they enter an email that is already registered and submit, **Then** an inline error message appears below the email field stating "This email is already registered"
2. **Given** a user is on the registration form, **When** they enter a username that is already taken and submit, **Then** an inline error message appears below the username field stating "This username is already taken"
3. **Given** a user is on the registration form, **When** they submit with both an existing email and username, **Then** both inline errors appear simultaneously

---

### User Story 2 - OAuth registration without password field (Priority: P2)

Users registering via OAuth provider (e.g., Google, GitHub) are presented with a streamlined registration form that excludes the password field, as authentication is handled by the OAuth provider.

**Why this priority**: Requiring OAuth users to enter a password is confusing and unnecessary since their identity is already verified by the OAuth provider.

**Independent Test**: Can be fully tested by initiating OAuth registration flow and verifying the form displays only relevant fields without a password input.

**Acceptance Scenarios**:

1. **Given** a user initiates registration via OAuth provider, **When** the registration form is displayed, **Then** no password field is shown
2. **Given** a user is completing OAuth registration, **When** they submit the form, **Then** their account is created with the OAuth provider's verified email

---

### Edge Cases

- What happens when network error occurs during registration submission?
- How does the system handle concurrent registration attempts with the same email/username?
- What if an OAuth provider is unavailable during registration?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display validation errors for existing email directly below the email input field
- **FR-002**: System MUST display validation errors for existing username directly below the username input field
- **FR-003**: System MUST hide password field when user is registering via OAuth provider
- **FR-004**: System MUST allow registration to proceed without password field when using OAuth
- **FR-005**: System MUST clear inline validation errors when user modifies the corresponding field

### Key Entities _(include if feature involves data)_

- **User**: Represents a registered user account with attributes for email, username, and authentication method
- **RegistrationAttempt**: Tracks registration attempts including timestamp, authentication method, and validation status

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users see inline validation errors within 1 second of form submission when email/username already exists
- **SC-002**: Zero toast notifications appear for email/username validation errors
- **SC-003**: OAuth users complete registration without seeing any password-related fields
- **SC-004**: 95% of registration attempts with validation errors result in successful correction on second attempt

## Assumptions

- OAuth registration flow already exists and only needs the form UI modification
- The existing validation logic for checking email/username uniqueness will be reused
- Toast notification system will be replaced with inline field errors for this specific validation case
