import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  user: User | null = null;
  gymStatus: string = '';
  isLoading = true;
  errorMessage = '';
  lastUpdated: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadGymStatus();
  }

  loadGymStatus(): void {
    this.authService.getGymStatus().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.gymStatus = response.status || 'closed';
        this.lastUpdated = response.last_updated || new Date().toLocaleString();
        this.errorMessage = '';
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load gym status';
        this.gymStatus = 'unknown';
        this.lastUpdated = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
