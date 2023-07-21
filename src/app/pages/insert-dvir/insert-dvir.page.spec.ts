import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertDvirPage } from './insert-dvir.page';

describe('InsertDvirPage', () => {
  let component: InsertDvirPage;
  let fixture: ComponentFixture<InsertDvirPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InsertDvirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
