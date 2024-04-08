import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InterMessage {
  topic: string;
  value?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InterService {
  private messageSource: BehaviorSubject<InterMessage> = new BehaviorSubject<InterMessage>(null);

  currentMessage: Observable<InterMessage> = this.messageSource.asObservable();

  changeMessage(message: InterMessage) {
    this.messageSource.next(message);
  }
}
