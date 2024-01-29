import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDataWriterComponent } from './start-data-writer.component';

describe('StartDataWriterComponent', () => {
  let component: StartDataWriterComponent;
  let fixture: ComponentFixture<StartDataWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartDataWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartDataWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
