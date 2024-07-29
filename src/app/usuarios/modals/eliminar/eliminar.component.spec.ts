import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EliminarComponent } from './eliminar.component';

describe('EliminarComponent', () => {
  let component: EliminarComponent;
  let fixture: ComponentFixture<EliminarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [EliminarComponent]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
