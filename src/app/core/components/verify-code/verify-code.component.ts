import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent {
  verifyForm: FormGroup;
  errMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) {
      this.errMsg = 'Please enter email and verification code.';
      return;
    }

    // TODO: Implement verify code API call
    this.successMsg = 'Email verified successfully!';
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }
}

