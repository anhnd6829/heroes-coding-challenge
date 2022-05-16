import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';


describe('MessageService', () => {
  let service: SharedService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should give color code', () => {
    expect(service.getRankCss(2, true)).toBe('#17a2b8');
    expect(service.getRankCss(1, true)).toBe('#28a745');
  });
  it('should update list item', () => {
    const array = [{
      id: 1,
      value: 3
    }];
    const arrayUpdate = service.updateItem(array, 1, 'value', 5);
    expect(arrayUpdate[0]).toEqual({
      id: 1,
      value: 5
    });
  });
  it('should update money', () => {
    service.updateReplaceMoneyData(100);
    expect(service.moneyCurrent).toBe(100);
    const currentMoney = service.moneyCurrent;
    service.updateUserMoney(-100);
    expect(service.moneyCurrent).toBe(currentMoney - 100);
    service.updateReplaceMoneyData(-1000);
    expect(service.moneyCurrent).toBe(0);
  });

});
