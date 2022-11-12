import { TemplateResult } from 'lit-html';

export enum NotificationType {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

export type Notification = {
  id: string;
  timestamp: number;
  message: string | TemplateResult;
  type: NotificationType;
  toast: boolean;
};
