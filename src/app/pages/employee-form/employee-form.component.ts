import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  @Output() onCloseModel = new EventEmitter();

  onClose() {
    this.onCloseModel.emit(false);
  }
}
