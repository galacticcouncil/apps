import en from './translation.en.json';
import { translation as signer } from 'signer';

export const translation = {
  en: { ...signer.en, ...en },
};
