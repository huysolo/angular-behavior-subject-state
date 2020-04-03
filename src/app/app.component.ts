import { Component, Injectable, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  id: string;
  content: string;
}
@Injectable({
  providedIn: 'root'
})
export class MessageStore {
  private state$ = new BehaviorSubject<Message[]>([]);


  setState(state) {
    this.state$.next(state)
  }

  updateState(state) {
    this.setState( this.state$.value.map(v => v.id === state.id ? state :v));
  }
  addState(state) {
    this.setState([
      ...this.state$.value,
      state
    ]);

  }

  selectMessage() {
    return this.state$.asObservable();
  }
}


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private messageStore: MessageStore) {

  }

  addMessage(content) {
    this.messageStore.addState({
      id: new Date().getTime(),
      content
    })
  }

  updateMessage(state) {
     this.messageStore.updateState(state)
  }

}

@Component({
  selector: 'my-app',
  template: `
    <h3>Message:</h3>
    <div  *ngFor="let msg of message$ | async">
      <input [value]="msg.content" (keydown.enter)="updateMessage({
        id: msg.id,
        content: $event.target.value
      })">
      <br>
      <br>
    </div>
    New Message:
    <input (keydown.enter)="addMessage($event.target.value)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  name = 'Angular';
  message$
  constructor(private messageService: MessageService, private messageStore: MessageStore) {
    this.message$ = this.messageStore.selectMessage()
  }

  addMessage = this.messageService.addMessage
  updateMessage(value) {
    this.messageService.updateMessage(value)
  }

}
