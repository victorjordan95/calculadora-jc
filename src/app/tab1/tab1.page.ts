import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TabsService } from '../tabs/tabs.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

    public taxa = 6.52; // Atual Selic (01/03/2019)
    public matrizSemIR = [];
    public matrizComIR = [];
    public rendaMensal = 0;
    public valorFinalComIR = 0;
    public valorFinalSemIR = 0;
    public menorIR;
    public date = new Date();

    constructor(private tabService: TabsService, private router: Router) { }

    private async findTaxAndAddParcel(f) {
        this.rendaMensal = 0;

        // Encontro a taxa mensal em base da anual.
        const taxaMensal = (this.taxa / 100) / 12;

        // Crio cada parcela de aplicação
        for (let j = 0; j < f.value.tempo; j++) {
            let valorNovo = 0;

            // Encontro o juros de cada parcela por seus meses de aplicação
            for (let i = 1; i < f.value.tempo - j; i++) {
                i === 1 ? valorNovo = f.value.parcelas + (f.value.parcelas * taxaMensal) : valorNovo = valorNovo + (valorNovo * taxaMensal);

                if (j === 0 && i === f.value.tempo - 1) {
                    this.rendaMensal = valorNovo - f.value.parcelas;
                }
            }

            // Inserção de parcelas separadas em uma matriz
            j === f.value.tempo - 1 ? this.matrizSemIR[j] = f.value.parcelas : this.matrizSemIR[j] = valorNovo;

            await Promise.resolve(j);
        }
    }

    private async addIRParcel(f) {
        // Adicionando imposto de renda para cada parcela individual
        // Encontrando o menor IR
        for (let i = 0; i < f.value.tempo; i++) {

            if (f.value.tempo - i < 6) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - f.value.parcelas) * 0.225);
            } else if (f.value.tempo - i < 12) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - f.value.parcelas) * 0.2);
            } else if (f.value.tempo - i < 24) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - f.value.parcelas) * 0.175);
            } else {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - f.value.parcelas) * 0.15);
            }

            if (f.value.tempo - i < 6 && i === 0) {
                this.menorIR = '22.5%';
            } else if (f.value.tempo - i < 12 && i === 0) {
                this.menorIR = '20%';
            } else if (f.value.tempo - i < 24 && i === 0) {
                this.menorIR = '17.5%';
            } else if (f.value.tempo - i >= 24 && i === 0) {
                this.menorIR = '15%';
            }

            await Promise.resolve(i);
        }
    }

    /**
     * Soma todas as parcelas
     * com e sem Imposto de Renda
     */
    private async sumParcels() {
        this.matrizComIR.forEach(element => this.valorFinalComIR += element);
        this.matrizSemIR.forEach(element => this.valorFinalSemIR += element);
    }

    onSubmit(f: NgForm) {
        f.value.parcelas = parseFloat(f.value.parcelas);
        f.value.tempo = parseInt(f.value.tempo, 10);


        this.findTaxAndAddParcel(f).then(() => {
            this.addIRParcel(f).then(() => {
                this.sumParcels().then(res => {
                    const totalInvestido = f.value.parcelas * f.value.tempo;
                    const totalLucroBruto = this.valorFinalSemIR - totalInvestido;
                    const totalLucroLiquido = this.valorFinalComIR - totalInvestido;
                    this.tabService.setData('selic', [totalInvestido, totalLucroBruto, totalLucroLiquido, this.menorIR, this.rendaMensal, 'Taxa Selic', 'selic']);
                    this.router.navigateByUrl('/simulacao');
                    this.rendaMensal = 0;
                    this.valorFinalComIR = 0;
                    this.valorFinalSemIR = 0;
                    this.menorIR = undefined;
                    f.resetForm();
                })
            })
        });
    }
}
