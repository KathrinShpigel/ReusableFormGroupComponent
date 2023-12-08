import {
  Component,
  Input,
  OnInit,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reusable-form-group',
  templateUrl: './reusable-form-group.component.html',
  styleUrls: ['./reusable-form-group.component.css'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer): ControlContainer => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class ReusableFormGroupComponent implements OnInit {
  public get parentFormGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  @Input() public controlKey = '';

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
  ) {}

  public ngOnInit(): void {
    const formGroup = new FormGroup({
      email: this.fb.control('', [Validators.email, Validators.required]),
      emailConfirm: this.fb.control('', [
        Validators.email,
        Validators.required,
      ]),
    });
    this.addFormGroupToParent(formGroup);
  }

  public addFormGroupToParent(formGroup: AbstractControl): void {
    this.parentFormGroup.addControl(this.controlKey, formGroup);
  }

  public ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey);
  }
}
