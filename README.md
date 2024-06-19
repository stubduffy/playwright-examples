# Playwright examples

Repo showcasing the use of playwright to test the UI of demoblaze.com, and the 'countries' graphQL server provided by TrevorBlades.

## Setup environment

Install node dependencies: `npm install`
Install playwright browsers: `npx playwright install`

## Run the tests
Run just the UI tests:

`npx playwright test demoblaze-ui`

Run just the api tests:

`npx playwright test countries-graphql --project=webkit`

Or run all:
`npx playwright test`

## Future Improvements
 - Fix any flakiness
   - Running repeatedly still throws up the occasional fail, so these need to be ironed out.
 - Where possible, remove any hardcoded waits.
   - Certain actions were causing problems when happening seemingly too fast. each of these would need to be investigated in detail to find potential solutions.
 - Introduce page objects.
   - This would make code more reusable and make the tests more intuitive and readable.
