import IMask from 'imask';

export const priceMaskSettings: IMask.MaskedNumberOptions = {
  mask: Number,
  scale: 18,
  signed: false,
  thousandsSeparator: ' ',
  padFractionalZeros: false,
  normalizeZeros: true,
  radix: '.',
  mapToRadix: ['.'],
};

export const textMask: RegExp = /^[0-9a-zA-Z]+$/;
