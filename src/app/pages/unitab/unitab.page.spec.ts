import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitabPage } from './unitab.page';

describe('UnitabPage', () => {
  let component: UnitabPage;
  let fixture: ComponentFixture<UnitabPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UnitabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
