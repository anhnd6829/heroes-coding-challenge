import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Heroes of the Multiverses';

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }

  get money() {
    return this.sharedService.moneyCurrent;
  }

  clean() {
    window.localStorage.removeItem('herosData');
    this.sharedService.updateHeroData();
  }
}
