import { Component, OnInit } from '@angular/core';
import { TabsService } from '../tabs/tabs.service';
import { Router, NavigationStart  } from '@angular/router';

@Component({
    selector: 'app-simulacao',
    templateUrl: './simulacao.component.html',
    styleUrls: ['./simulacao.component.scss'],
})
export class SimulacaoComponent implements OnInit {

    public dataInfo: any;

    constructor(private tabService: TabsService, private router: Router) {

        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.getSimulationData();
            }
        });

    }

    ngOnInit() {
        this.getSimulationData();
    }

    redirectSelic() {
        this.router.navigateByUrl('/');
    }

    getSimulationData() {
        this.dataInfo = this.tabService.getData();
        console.log(this.dataInfo);
    }

}
