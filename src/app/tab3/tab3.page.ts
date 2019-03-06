import { Component } from '@angular/core';
import { TabsService } from '../tabs/tabs.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    public taxa = 6.4; // Atual CDI (01/03/2019)
    public matrizSemIR = [];
    public matrizComIR = [];
    public rendaMensal = 0;
    public valorFinalComIR = 0;
    public valorFinalSemIR = 0;
    public menorIR;
    public date = new Date();

    constructor(private tabService: TabsService, private router: Router) { }

    private async test(f) {
        const taxaMensal = (this.taxa / 100) / 12;

        for (let j = 0; j < f.value.tempo; j++) {
            let valorNovo = 0;
            const taxaIOF = 0.000082 * 30;

            for (let i = 1; i < f.value.tempo - j; i++) {
                i === 1 ?
                    valorNovo = f.value.parcelas + (f.value.parcelas * taxaMensal) - (f.value.parcelas * taxaIOF) :
                    valorNovo = valorNovo + (valorNovo * taxaMensal);

                if (j === 0 && i === f.value.tempo - 1) {
                    this.rendaMensal = valorNovo - f.value.parcelas;
                }
            }

            j === f.value.tempo - 1 ? this.matrizSemIR[j] = f.value.parcelas : this.matrizSemIR[j] = valorNovo;

            await Promise.resolve(j);
        }
    }

    private async calc2(f) {

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

    private async sumParcels() {
        this.matrizComIR.forEach(element => this.valorFinalComIR += element);
        this.matrizSemIR.forEach(element => this.valorFinalSemIR += element);
    }

    onSubmit(f: NgForm) {
        f.value.parcelas = parseFloat(f.value.parcelas);
        f.value.tempo = parseInt(f.value.tempo, 10);


        this.test(f).then(() => {
            console.log('for finished, triggering calc2');
            this.calc2(f).then(() => {
                console.log('calc2 finished, triggerind the results')
                this.sumParcels().then(res => {
                    const totalInvestido = f.value.parcelas * f.value.tempo;
                    const totalLucroBruto = this.valorFinalSemIR - totalInvestido;
                    const totalLucroLiquido = this.valorFinalComIR - totalInvestido;
                    this.tabService.setData('nuconta', [totalInvestido, totalLucroBruto, totalLucroLiquido, this.menorIR, this.rendaMensal, 'NuConta', 'nuconta']);
                    this.router.navigateByUrl('/simulacao');
                });
            });
        });
    }
}
