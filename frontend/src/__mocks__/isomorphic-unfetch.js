// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require("fetch-mock");

const fetch = fetchMock.sandbox();
module.exports = fetch;
