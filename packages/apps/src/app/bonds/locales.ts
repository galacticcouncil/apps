import en from './translation.en.json';
import { translation as trade } from 'app/trade';

export const translation = {
  en: { ...trade.en, ...en },
};
