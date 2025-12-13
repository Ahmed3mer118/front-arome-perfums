import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  errMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      resetCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.errMsg = 'Please fill all fields correctly.';
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.errMsg = 'Passwords do not match.';
      return;
    }

    // TODO: Implement reset password API call
    this.successMsg = 'Password reset successfully!';
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }
}

