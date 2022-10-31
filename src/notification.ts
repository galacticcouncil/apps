import { AlertVariant } from './component/Alert';

export type TradeNotification = {
  id: string;
  timestamp: number;
  message: string;
  variant: AlertVariant;
};

export function sendNotification(timeout: number, variant: AlertVariant, status: string) {
  const options = {
    bubbles: true,
    composed: true,
    detail: { timeout: timeout, variant: variant, mssg: this.buildNotificationMessg(status) },
  };
  this.dispatchEvent(new CustomEvent('trade-notification', options));
}
