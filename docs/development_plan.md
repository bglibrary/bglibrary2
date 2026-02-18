# Development Plan

This document outlines the detailed plan to address the current issues and complete the remaining steps of the project.

## Phase 1: Fix Existing Errors
- [ ] **Fix PostCSS Configuration**: Update `postcss.config.js` to use `@tailwindcss/postcss` instead of `tailwindcss` directly.
- [ ] **Remove `output: 'export'`**: Remove `output: 'export'` from `next.config.js` as it conflicts with API routes.
- [ ] **Add missing `dev` script**: Add `"dev": "next dev"` to the `scripts` section in `package.json`.
- [ ] **Verify Local Development**: Run `npm run dev` to ensure the project starts without errors and the basic pages are accessible.

## Phase 2: Complete Step 11 — Selection Guide (Logic & UI)
- [ ] **11.1 Implement SelectionGuide Logic**: Create `src/selection/SelectionGuide.js`, `src/selection/selectionTypes.js`, and `src/selection/selectionErrors.js`. Implement the pure, stateless `SelectionGuide` function, including eligibility filtering and optional ranking with explanations.
- [ ] **11.2 Implement SelectionGuide UI Component**: Create `components/SelectionGuideUI.js` and integrate it into a new page (`pages/selection-guide.js`). This component will allow users to input constraints, display selected games as `GameCard`s, and show explanations.
- [ ] **Add Navigation**: Add a link to the Selection Guide page in the main navigation (e.g., `_app.js` or `index.js`).

## Phase 3: Final Review and Acceptance
- [ ] **11.3 End-to-End Acceptance Testing**: Manually verify all acceptance criteria outlined in `phase_6_2_acceptance_criteria.md` for both visitor and admin flows, including the new Selection Guide.
- [ ] **Comprehensive Code Review**: Conduct a final code review to ensure adherence to all global implementation rules, error handling, and documentation standards.
- [ ] **Update Documentation**: Update any remaining `specs/` documents with changes and ensure all inline comments and JSDoc are complete.
