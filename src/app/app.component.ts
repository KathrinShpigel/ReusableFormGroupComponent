import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public form!: FormGroup;
  public name: string = '';
  public isNestedForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required]),
    });

    this.cdr.detectChanges();
  }

  save(): void {
    console.log(this.form.value);
    this.markFormGroupTouched(this.form);
    if (this.form.invalid) return;
    console.log(this.form.value);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsDirty();
      }
    });
  }

  handleNestedForm() {
    this.isNestedForm = !this.isNestedForm;
  }
}
