const fetch = require('node-fetch');

/*
  Could not find any public api, so using nse india's endpoints used by their webpages,
  These are not realtime, but would do for this small application

  Also as these need to be hit from browser only,
  adding `Referer` and `User-Agent` to pretend request is from browser
*/

const QUOTE_INFO_URL =
  'https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?series=EQ&symbol=';
const GET_QUOTE_URL =
  'https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol=';

async function getLastPrice(symbol) {
  const resp = await fetch(QUOTE_INFO_URL + encodeURIComponent(symbol), {
    method: 'get',
    headers: {
      Referer: GET_QUOTE_URL + encodeURIComponent(symbol),
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    },
  });
  const { data } = await resp.json();
  return parseFloat(data[0].lastPrice.replace(/,/g, ''));
}

module.exports = { getLastPrice };
