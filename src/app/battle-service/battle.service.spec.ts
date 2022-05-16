import { TestBed } from '@angular/core/testing';
import { Mob } from '../model/mob.model';

import { BattleService } from './battle.service';

describe('BattleService', () => {
  let service: BattleService;
  let mocMonster: Mob

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be fight', () => {

    expect(service).toBeTruthy();
  });
});
