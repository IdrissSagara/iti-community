import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit {


  showDrawer: boolean = false;
  constructor() {
  }

  ngOnInit(): void {
  }

  onToggleNotifications() {
    !this.showDrawer ? this.showDrawer = true : this.showDrawer = false;

  }
}
