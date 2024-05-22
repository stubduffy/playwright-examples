# rasa challenge - UI and GraphQL tests

## Setup environment

`npm install`
`npx playwright install`

## Run the tests
Run just the UI tests:

`npx playwright test demoblaze-ui`

Run just the api tests:

`npx playwright test countries-graphql --project=webkit`

Or run all:
`npx playwright test`

## Future Improvements
 - fix any flakiness
 - where possible, remove any hardcoded waits
 - probably introduce page objects