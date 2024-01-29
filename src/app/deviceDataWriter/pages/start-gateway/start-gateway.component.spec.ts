import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartGatewayComponent } from './start-gateway.component';

describe('StartGatewayComponent', () => {
  let component: StartGatewayComponent;
  let fixture: ComponentFixture<StartGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
