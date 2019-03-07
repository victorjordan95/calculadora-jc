import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  private dataInfo = [];

  constructor() { }

  /**
   * Salva os valores calculados para
   * serem usados na pagina de simulação
   * @param nome nome do investimento
   * @param data conteúdo do investimento
   */
  setData(nome, data) {
    if (this.dataInfo.length) {
      this.dataInfo = this.dataInfo.filter(el => el[6] !== nome );
    }
    this.dataInfo.push(data);
  }

  /**
   * Retorna os valores
   * salvos pela simulação
   */
  getData() {
    return this.dataInfo;
  }

}
