import { Component } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  component?: PlayerComponent;
  constructor(
    private shared: SharedService
  ) {
    this.shared.setupData();
  }
}
