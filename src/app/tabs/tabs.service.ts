import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TabsService {

    private dataInfo = [];
    protected TOKEN = 'd9cbf075';
    public taxa;

    constructor(private _http: HttpClient) { }

    /**
     * Salva os valores calculados para
     * serem usados na pagina de simulação
     * @param nome nome do investimento
     * @param data conteúdo do investimento
     */
    setData(nome, data) {
        if (this.dataInfo.length) {
            this.dataInfo = this.dataInfo.filter(el => el[6] !== nome);
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

    /**
     * Fetch from API the
     * tax values
     */
    getTax() {
        return this._http.get(`https://api.hgbrasil.com/finance/taxes?format=json-cors&key=${this.TOKEN}`);
    }

}
