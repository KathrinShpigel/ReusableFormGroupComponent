import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';
import { ReusableFormGroupComponent } from './reusable-form-group.component';

const controlKey = 'test';

describe('ReusableFormGroupComponent', () => {
  let component: ReusableFormGroupComponent;
  let fixture: ComponentFixture<ReusableFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReusableFormGroupComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    TestBed.overrideComponent(ReusableFormGroupComponent, {
      set: {
        viewProviders: [
          {
            provide: ControlContainer,
            useFactory: (formBuilder: FormBuilder) => {
              const formGroupDirective = new FormGroupDirective([], []);
              formGroupDirective.form = formBuilder.group({});
              return formGroupDirective;
            },
            deps: [FormBuilder],
          },
        ],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusableFormGroupComponent);
    component = fixture.componentInstance;
    component.controlKey = controlKey;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add form controls to the group of parent forms', () => {
    expect(component.parentFormGroup.get(controlKey)).toBeTruthy();
    expect(component.parentFormGroup.get(controlKey).get('email')).toBeTruthy();
    expect(
      component.parentFormGroup.get(controlKey).get('emailConfirm'),
    ).toBeTruthy();
  });

  it('should validate the format of the email', () => {
    const emailControl = component.parentFormGroup.get(controlKey).get('email');

    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('email')).toBeTrue();

    emailControl.setValue('valid@example.com');
    expect(emailControl.hasError('email')).toBeFalse();
  });

  it('should delete form controls when ngOnDestroy is used', () => {
    component.ngOnDestroy();
    expect(component.parentFormGroup.get(controlKey)).toBeFalsy();
  });
});
