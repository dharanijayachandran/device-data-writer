import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopDataWriterComponent } from './stop-data-writer.component';

describe('StopDataWriterComponent', () => {
  let component: StopDataWriterComponent;
  let fixture: ComponentFixture<StopDataWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopDataWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopDataWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
