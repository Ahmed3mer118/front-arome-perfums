import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  forgetForm: FormGroup;
  successMsg = '';
  errMsg = '';

  constructor(private fb: FormBuilder) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgetForm.invalid) {
      this.errMsg = 'Please enter a valid email address.';
      return;
    }
    // TODO: Implement forget password API call
    this.successMsg = 'Password reset link sent to your email.';
  }
}

