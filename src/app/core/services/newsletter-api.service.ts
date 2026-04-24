import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  SubscriberResponse,
  SubscribeRequest,
  SendNewsletterRequest
} from '../models/newsletter.model';

@Injectable({ providedIn: 'root' })
export class NewsletterApiService {
  private http = inject(HttpClient);
  private base = environment.gateway;

  subscribe(req: SubscribeRequest) {
    return this.http.post<SubscriberResponse>(
      `${this.base}/newsletter/subscribe`, req
    );
  }

  getCount() {
    return this.http.get<{ count: number }>(
      `${this.base}/newsletter/count`
    );
  }

  getAllSubscribers() {
    return this.http.get<SubscriberResponse[]>(
      `${this.base}/newsletter/subscribers`
    );
  }

  sendNewsletter(req: SendNewsletterRequest) {
    return this.http.post<{ message: string }>(
      `${this.base}/newsletter/send`, req
    );
  }
}
