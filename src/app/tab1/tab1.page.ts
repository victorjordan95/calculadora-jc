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

    public taxa = 0.0652;
    public matrizSemIR = [];
    public matrizComIR = [];
    public valorNovo = 0;
    public valorFinalComIR = 0;
    public valorFinalSemIR = 0;
    public menorIR;
    public rendaMensal = 0;

    constructor(private tabService: TabsService, private router: Router) { }

    private async test(f) {
        for (let j = 0; j < f.value.tempo; j++) {

            for (let i = 1; i < f.value.tempo - j; i++) {
                if (i === 1) {
                    this.valorNovo = f.value.parcelas + (f.value.parcelas * (this.taxa / 12))
                } else {
                    this.valorNovo = this.valorNovo + (this.valorNovo * (this.taxa / 12))
                    if (j===0){
                        this.rendaMensal = this.valorNovo - f.value.parcelas
                    }
                }
            }


            if (j === f.value.tempo - 1) {
                this.valorNovo = f.value.parcelas
            }

            this.matrizSemIR[j] = this.valorNovo
            this.valorNovo = 0

            await Promise.resolve(j);
        }
    }

    private async calc2(f) {
        
        for (let i=0;i<f.value.tempo;i++){

            if (f.value.tempo-i < 6){
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i]-f.value.parcelas) * 0.225)
            } else if (f.value.tempo-i < 12) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i]-f.value.parcelas) * 0.2)
            } else if (f.value.tempo-i < 24) {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i]-f.value.parcelas) * 0.175)
            } else {
                this.matrizComIR[i] = this.matrizSemIR[i] - ((this.matrizSemIR[i]-f.value.parcelas) * 0.15)
            }

            if (f.value.tempo-i < 6 && i===0){
                this.menorIR = "22.5%";
            } else if (f.value.tempo-i < 12 && i===0) {
                this.menorIR = "20%";
            } else if (f.value.tempo-i < 24 && i===0) {
                this.menorIR = "17.5%";
            } else if (f.value.tempo-i >= 24 && i===0){
                this.menorIR = "15%";
            }

            await Promise.resolve(i);
        }
    }

    private async showResult(f) {
        for (let i = 0; i < f.value.tempo; i++) {
            this.valorFinalComIR = this.valorFinalComIR + this.matrizComIR[i];
            this.valorFinalSemIR = this.valorFinalSemIR + this.matrizSemIR[i];

            await Promise.resolve(i);
        }

    }

    onSubmit(f: NgForm) {
        f.value.parcelas = parseInt(f.value.parcelas, 10);
        f.value.tempo = parseInt(f.value.tempo, 10);


        this.test(f).then(() => {
            console.log('for finished, triggering calc2');
            this.calc2(f).then(() => {
                console.log('calc2 finished, triggerind the results')
                this.showResult(f).then(res => {
                    const totalInvestido = f.value.parcelas * f.value.tempo;
                    const totalLucroBruto = this.valorFinalSemIR - totalInvestido;
                    const totalLucroLiquido = this.valorFinalComIR - totalInvestido;
                    this.tabService.setData([totalInvestido, totalLucroBruto, totalLucroLiquido, this.menorIR, this.rendaMensal]);
                    this.router.navigateByUrl('/tabs/tab2');
                    
                })
                
            })
        });

    }

}
