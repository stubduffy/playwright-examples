import { test, expect } from "@playwright/test";


test.describe("Graphql API tests", () => {

  test("Should be able to query & filter continents", async ({ request }) => {
    const response = await request.post(
      "",
      {
        data: {
          query: `
                query {
                    continents(filter: {code: {ne: "EU"}}) {
                        ${selectedContinentFields}
                    }
                }
            `,
        },
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
    for (const continent of json.data.continents)
      expect(continent.name).not.toEqual("Europe");
  });

  test("Should be able to query a specific continent", async ({ request }) => {
    const response = await request.post(
        "",
        {
          data: {
            query: `
                query {
                    continent(code: "AF") {
                        ${selectedContinentFields}
                    }
                }
            `,
          },
        }
      );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.continent.name).toStrictEqual("Africa");
  });

  test("Should be able to query & filter countries", async ({ request }) => {
    const response = await request.post(
      "",
      {
        data: {
          query: `
            query {
                countries(filter: {code: {in: ["RA", "SA"]}}) {
                    ${selectedCountryFields}
                }
            }
        `,
        },
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.countries).toHaveLength(1);
    expect(json.data.countries[0].name).toStrictEqual("Saudi Arabia");
  });

  test.fail("Should be able to filter countries with regex", async ({ request }) => {
    const response = await request.post(
      "",
      {
        data: {
          query: `
            query {
                countries(filter: {code: {regex: "/^A.*/"}}) {
                    ${selectedCountryFields}
                }
            }
        `,
        },
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.countries).not.toHaveLength(0);
  });

  test("Should be able to query a specific country", async ({ request }) => {
    const response = await request.post(
        "",
        {
          data: {
            query: `
                query {
                    country(code: "GB") {
                        ${selectedCountryFields}
                    }
                }
            `,
          },
        }
      );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.country.name).toStrictEqual("United Kingdom");
    expect(json.data.country.subdivisions).toHaveLength(4); // maybe an unstable check, #Scexit :D
  });

  test("Should be able to get a country name in specific language", async ({ request }) => {
    const response = await request.post(
        "",
        {
          data: {
            query: `
                query {
                    country(code: "ES") {
                        name(lang: "fr")
                    }
                }
            `,
          },
        }
      );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.country.name).toStrictEqual("Espagne");
  });

  test("Should be able to query & filter languages", async ({ request }) => {
    const response = await request.post(
      "",
      {
        data: {
          query: `
            query {
                languages(filter: {code: {eq: "de"}}) {
                    ${selectedLanguageFields}
                }
            }
        `,
        },
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.languages).toHaveLength(1);
    expect(json.data.languages[0].name).toStrictEqual("German");
  });

  test("Should be able to query a specific language", async ({ request }) => {
    const response = await request.post(
        "",
        {
          data: {
            query: `
            query {
                language(code: "ga") {
                    ${selectedLanguageFields}
                }
            }
        `,
          },
        }
      );
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.data.language.name).toStrictEqual("Irish");
  });

  test("Should return error if query malformed (e.g. no fields)", async ({ request }) => {
    const invalidQuery = `
        query {
            countries {
            }
        }
    `;

    let response = await request.post(
      "",
      {
        data: {
          query: invalidQuery,
        },
      }
    );

    const failureJson = await response.json();
    expect(failureJson.errors[0].message).toStrictEqual("The request did not contain a valid GraphQL request.  Batch queries and APQ request are not currently supported for this API. Please ensure that your request contains a valid query and try again.");
  });

  test("Should return error if query missing required param", async ({ request }) => {
    const invalidQuery = `
        query {
            country {
                name
            }
        }
    `;

    let response = await request.post(
      "",
      {
        data: {
          query: invalidQuery,
        },
      }
    );

    const failureJson = await response.json();
    expect(failureJson.errors[0].message).toStrictEqual("Field \"country\" argument \"code\" of type \"ID!\" is required, but it was not provided.");
  });
});

const selectedContinentFields = `
    code
    name
    countries {
        code
    }
`

const selectedCountryFields = `
    code
    name
    languages {
        name
    }
    currency
    capital
    subdivisions {
      emoji
    }
`

const selectedLanguageFields = `
    code
    name
    native
    rtl
`
