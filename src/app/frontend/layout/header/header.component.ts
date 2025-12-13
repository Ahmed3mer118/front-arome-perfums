import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string | null = null;
  cartCount = 0;
  isMenuOpen = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check auth status
    const tokenSub = this.authService.getTokenObservable().subscribe(token => {
      this.isLoggedIn = !!token;
      this.userName = this.authService.getName();
    });
    this.subscriptions.push(tokenSub);

    // Check cart count
    const cartSub = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.subscriptions.push(cartSub);

    // Initial check
    this.isLoggedIn = !!this.authService.getToken();
    this.userName = this.authService.getName();
    this.cartCount = this.cartService.getCartCount();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

