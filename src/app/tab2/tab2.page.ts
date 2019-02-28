import { Component, OnInit } from '@angular/core';
import { TabsService } from '../tabs/tabs.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page  implements OnInit {

  public dataInfo;

  constructor(private tabService: TabsService) {}

  ngOnInit() {
    this.dataInfo = this.tabService.getData();
    console.log(this.dataInfo);
  }

}