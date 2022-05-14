import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    const current = new Date();
    this.messages.push('(' +current.getHours().toLocaleString() +':'+ current.getMinutes().toLocaleString() + ') ' + message);
  }

  clear() {
    this.messages = [];
  }
}
