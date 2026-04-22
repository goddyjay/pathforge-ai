// All rates express: 1 NGN = X of target currency.
// Ballpark 2026 rates — edit as needed. No network calls.
export const CURRENCIES = {
  NGN: { code: "NGN", symbol: "₦", label: "Nigerian Naira", rateFromNgn: 1, locale: "en-NG" },
  USD: { code: "USD", symbol: "$", label: "US Dollar", rateFromNgn: 1 / 1600, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", label: "Euro", rateFromNgn: 1 / 1750, locale: "en-IE" },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", rateFromNgn: 1 / 2000, locale: "en-GB" },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);

// Keyword → currency code. Checked in order; first match wins.
const LOCATION_RULES = [
  { match: /nigeria|lagos|abuja|ibadan|port\s?harcourt|kano|benin|naija/i, code: "NGN" },
  { match: /united\s?kingdom|\buk\b|england|britain|london|manchester|scotland|wales/i, code: "GBP" },
  { match: /united\s?states|\busa?\b|america|new\s?york|san\s?francisco|california|texas|chicago|boston|seattle|miami/i, code: "USD" },
  { match: /canada|toronto|vancouver|montreal/i, code: "USD" },
  { match: /germany|france|spain|italy|netherlands|ireland|portugal|belgium|austria|finland|greece|berlin|paris|madrid|amsterdam|dublin|lisbon|rome/i, code: "EUR" },
  { match: /ghana|kenya|south\s?africa|egypt|morocco|rwanda|uganda|tanzania/i, code: "USD" }, // default African outside NGN to USD
];

export function detectCurrencyFromLocation(location) {
  if (!location) return "NGN";
  for (const rule of LOCATION_RULES) {
    if (rule.match.test(location)) return rule.code;
  }
  return "NGN";
}

export function convertFromNgn(amountNgn, code) {
  const c = CURRENCIES[code] ?? CURRENCIES.NGN;
  return amountNgn * c.rateFromNgn;
}

export function convertToNgn(amount, code) {
  const c = CURRENCIES[code] ?? CURRENCIES.NGN;
  return amount / c.rateFromNgn;
}

export function formatMoney(amountInCurrency, code, { compact = false, noDecimals = true } = {}) {
  const c = CURRENCIES[code] ?? CURRENCIES.NGN;
  const opts = {
    style: "currency",
    currency: c.code,
    maximumFractionDigits: noDecimals ? 0 : 2,
  };
  if (compact && Math.abs(amountInCurrency) >= 10000) {
    opts.notation = "compact";
    opts.maximumFractionDigits = 1;
  }
  try {
    return new Intl.NumberFormat(c.locale, opts).format(amountInCurrency);
  } catch {
    return `${c.symbol}${Math.round(amountInCurrency).toLocaleString()}`;
  }
}

export function formatFromNgn(amountNgn, code, options) {
  return formatMoney(convertFromNgn(amountNgn, code), code, options);
}
