export interface SubscriberResponse {
  subscriberId: string;
  email: string;
  fullName?: string | null;
  userId?: string | null;
  status: string;
  subscribedAt: string;
  confirmedAt?: string | null;
}

export interface SubscribeRequest {
  email: string;
  fullName?: string | null;
  userId?: string | null;
}

export interface SendNewsletterRequest {
  subject: string;
  htmlContent: string;
}
