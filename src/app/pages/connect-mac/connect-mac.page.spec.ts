import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ConnectMacPage } from './connect-mac.page';

describe('ConnectMacPage', () => {
  let component: ConnectMacPage;
  let fixture: ComponentFixture<ConnectMacPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConnectMacPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
