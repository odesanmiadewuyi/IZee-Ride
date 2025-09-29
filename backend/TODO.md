# TODO: Refactor routes with inline logic

- [x] Add getCurrentUser function to src/controllers/users.controller.ts
- [x] Update src/routes/users.routes.ts to use the controller instead of inline logic
- [x] Remove redundant req.user check from the route
- [x] Test the endpoint to ensure it works correctly with authentication
- [x] Add getProfile function to src/controllers/auth.controller.ts
- [x] Update src/routes/auth.routes.ts to use the controller instead of inline logic
- [x] Verify all route files are properly structured (auth, users, rides, payments, vehicles)
