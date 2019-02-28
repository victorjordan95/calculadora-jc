import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public dataInfo;

  constructor() { }

  setData(data) {
    this.dataInfo = data;
  }

  getData() {
    return this.dataInfo;
  }

}
