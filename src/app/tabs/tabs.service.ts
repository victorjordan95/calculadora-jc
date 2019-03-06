import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public dataInfo = [];

  constructor() { }

  setData(nome, data) {
    if (this.dataInfo.length) {
      this.dataInfo = this.dataInfo.filter(el => {
        return el[6] !== nome;
      });
    }
    this.dataInfo.push(data);
  }

  getData() {
    return this.dataInfo;
  }

}
