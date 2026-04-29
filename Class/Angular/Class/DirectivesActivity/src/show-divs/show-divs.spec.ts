import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDivs } from './show-divs';

describe('ShowDivs', () => {
  let component: ShowDivs;
  let fixture: ComponentFixture<ShowDivs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDivs],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDivs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
