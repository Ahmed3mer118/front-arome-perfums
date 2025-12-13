import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { IRegister } from '../../interfaces/interface.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['customer'],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errMsg = 'Please fill all required fields correctly.';
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errMsg = 'Passwords do not match.';
      return;
    }

    const { full_name, email, phone, role } = this.registerForm.value;
    const registerData: IRegister = {
      full_name,
      email,
      phone,
      password,
      role: role || 'customer',
    };

    this._authService.register(registerData).subscribe({
      next: (res) => {
        this.successMsg = 'Registration successful! Please login.';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.errMsg = err?.error?.error || err?.error?.message || 'Registration failed.';
      },
    });
  }
}

