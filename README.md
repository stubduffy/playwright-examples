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


