# Explore Feature

Explore the feature named by the user from a QA perspective. Use the existing
application, repository documentation, and visible UI where available. Do not
invent requirements or claim that a behavior was verified without evidence.

For the feature:

1. Identify the main workflow.
2. List all inputs.
3. Identify the field type.
4. Identify required and optional fields.
5. Identify validations and constraints.
6. Suggest valid and invalid values.
7. Suggest equivalence classes.
8. Suggest boundary values.
9. Identify negative scenarios.
10. Identify edge cases.

Return the result in this order:

1. Feature and workflow summary.
2. Inputs table with input name, field type, required/optional status, known constraint, and evidence source.
3. Equivalence classes with representative values.
4. Boundary values and negative scenarios.
5. Unknowns and clarification questions.
6. Candidate manual and Playwright test scenarios.

Clearly label anything unknown, assumed, or needing clarification. Never include
real credentials in the output.
