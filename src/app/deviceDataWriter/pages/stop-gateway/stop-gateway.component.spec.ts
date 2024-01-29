import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopGatewayComponent } from './stop-gateway.component';

describe('StopGatewayComponent', () => {
  let component: StopGatewayComponent;
  let fixture: ComponentFixture<StopGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
