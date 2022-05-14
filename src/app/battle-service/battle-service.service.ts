import { Injectable } from '@angular/core';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class BattleServiceService {

  constructor(
    private shared: SharedService
  ) { }

    prepareMonster() {

    }
}
