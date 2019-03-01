import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoPage } from './simulacao.page';

describe('SimulacaoPage', () => {
  let component: SimulacaoPage;
  let fixture: ComponentFixture<SimulacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulacaoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
