import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  isMobile: boolean;
  constructor() {
     if (window.innerWidth < 1024) {
       this.isMobile = true;
     } else {
       this.isMobile = false;
     }
  }
}
