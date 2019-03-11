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
    public isDisabled: boolean=true;
    public capitalInicial = 0;
    public meses;
    public capitalMensal;

    constructor(private tabService: TabsService, private router: Router) { }

    private async findTaxAndAddParcel() {
        this.rendaMensal = 0;

        // Encontro a taxa mensal em base da anual.
        const taxaMensal = (this.taxa / 100) / 12;

        // Crio cada parcela de aplicação
        for (let j = 0; j < this.meses; j++) {
            let valorNovo = 0;

            // Encontro o juros de cada parcela por seus meses de aplicação
            if (this.isDisabled === false && j === 0){

                // Juros Composto para casos com capital inicial
                for (let i = 1; i < this.meses - j; i++) {
                    i === 1 ? valorNovo = this.capitalInicial + (this.capitalInicial * taxaMensal) : valorNovo = valorNovo + (valorNovo * taxaMensal);

                    if (j === 0 && i === this.meses - 1) {
                        this.rendaMensal = valorNovo - this.capitalInicial;
                    }
                }

            } else {
                
                // Juros Composto para casos sem capital inicial
                for (let i = 1; i < this.meses - j; i++) {
                    i === 1 ? valorNovo = this.capitalMensal + (this.capitalMensal * taxaMensal) : valorNovo = valorNovo + (valorNovo * taxaMensal);

                    if (j === 0 && i === this.meses - 1) {
                        this.rendaMensal = valorNovo - this.capitalMensal;
                    }
                }
            }

            // Inserção de parcelas separadas em uma matriz
            j === this.meses - 1 ? this.matrizSemIR[j] = this.capitalMensal : this.matrizSemIR[j] = valorNovo;

            await Promise.resolve(j);
        }
    }

    private async addIRParcel() {
        // Adicionando imposto de renda para cada parcela individual
        // Encontrando o menor IR
        for (let i = 0; i < this.meses; i++) {

            if (this.meses - i <= 7) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - this.capitalMensal) * 0.225);
            } else if (this.meses - i <= 13) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - this.capitalMensal) * 0.2);
            } else if (this.meses - i <= 25) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - this.capitalMensal) * 0.175);
            } else {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i] - this.capitalMensal) * 0.15);
            }

            if (this.meses - i <= 7 && i === 0) {
                this.menorIR = '22.5%';
            } else if (this.meses - i <= 13 && i === 0) {
                this.menorIR = '20%';
            } else if (this.meses - i <= 25 && i === 0) {
                this.menorIR = '17.5%';
            } else if (this.meses - i > 25 && i === 0) {
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
        this.capitalMensal = parseFloat(f.value.parcelas);

        if (this.isDisabled === true) 
        {
            this.meses = parseInt(f.value.tempo, 10);
        } else {
            this.meses = parseInt(f.value.tempo, 10) + 1;
            this.capitalInicial = parseFloat(f.value.capital);
        }


        this.findTaxAndAddParcel().then(() => {
            this.addIRParcel().then(() => {
                this.sumParcels().then(res => {
                    const totalInvestido = (this.capitalMensal * parseInt(f.value.tempo, 10)) + this.capitalInicial;
                    const totalLucroBruto = this.valorFinalSemIR - totalInvestido;
                    const totalLucroLiquido = this.valorFinalComIR - totalInvestido;
                    const diasInvestidos = this.meses * 30;
                    this.tabService.setData('selic', [totalInvestido, totalLucroBruto, totalLucroLiquido, this.menorIR, this.rendaMensal, 'Taxa Selic', 'selic', diasInvestidos]);
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

    updateField() {
        this.isDisabled = !this.isDisabled;
        if (this.isDisabled === false) {
            this.capitalInicial = undefined;
        }
    }
}
