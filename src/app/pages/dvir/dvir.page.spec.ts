import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DvirPage } from './dvir.page';

describe('DvirPage', () => {
  let component: DvirPage;
  let fixture: ComponentFixture<DvirPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DvirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
