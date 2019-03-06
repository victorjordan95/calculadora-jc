import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public dataInfo = [];

  constructor() { }

  /**
   * Salva os valores calculados para
   * serem usados na pagina de simulação
   * @param nome nome do investimento
   * @param data conteudo do investimento
   * TODO Alterar o filter para uma linha
   */
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
