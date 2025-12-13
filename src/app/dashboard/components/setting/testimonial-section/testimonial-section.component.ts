import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-section',
  imports: [CommonModule],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.css'
})
export class TestimonialSectionComponent implements OnInit {
  isModalOpen = true;
  isLoading = false;
  error = '';
  testimonials: any[] = [];

  constructor(
    private authService: AuthService
  ) {}
 ngOnInit(): void {
    this.loadTestimonials()
 }

 
  loadTestimonials() {
    this.isLoading = true;
    this.error = '';
    // TODO: Implement testimonial service
    this.testimonials = [];
    this.isLoading = false;
  }
  toggleTestimonialStatus(id: string) {
    // TODO: Implement toggle testimonial status
  }
}

