import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HosPage } from './hos.page';

describe('HosPage', () => {
  let component: HosPage;
  let fixture: ComponentFixture<HosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
