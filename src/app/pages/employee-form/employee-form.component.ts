import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IEmployee } from '../shared/models/Employee';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnChanges {
  @Input() data: IEmployee | null = null;
  @Output() onCloseModel = new EventEmitter();

  employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {
    this.employeeForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      doj: new FormControl('', [Validators.required]),
    });
  }

  onClose() {
    this.onCloseModel.emit(false);
  }

  ngOnChanges(): void {
    if (this.data) {
      this.employeeForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        mobile: this.data.mobile,
        dob: formatDate(this.data.dob, 'yyyy-MM-dd', 'en'),
        doj: this.data.doj,
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      if (this.data) {
        this.employeeService
          .updateEmployee(this.data._id as string, this.employeeForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetEmployeeForm();
              this.toastr.success(response.message);
            },
          });
      } else {
        this.employeeService.createEmployee(this.employeeForm.value).subscribe({
          next: (response: any) => {
            this.resetEmployeeForm();
            this.toastr.success(response.message);
          },
        });
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  resetEmployeeForm() {
    this.employeeForm.reset();
    this.onClose();
  }
}
