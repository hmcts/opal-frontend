// The payer journey permits straight and curly apostrophes, but no other punctuation.
export const PAYER_NAME_PATTERN = /^[a-zA-Z\- '\u2019]*$/;
export const PAYER_TEXT_PATTERN = /^[a-zA-Z0-9\- '\u2019]*$/;
