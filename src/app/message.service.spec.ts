import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';


describe('MessageService', () => {
  let service: MessageService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add message', () => {
    service.add('test');
    expect(service.messages).toHaveSize(1);
  });

  it('should delete all messages', () => {
    service.clear();
    expect(service.messages).toHaveSize(0);
  });
});
