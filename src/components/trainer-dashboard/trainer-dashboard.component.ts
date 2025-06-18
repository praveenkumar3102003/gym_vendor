import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {
  user: User | null = null;
  currentGymStatus = '';
  newStatus = '';
  isLoading = true;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';
  lastUpdated = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadGymStatus();
  }

  loadGymStatus(): void {
    this.authService.getGymStatus().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.currentGymStatus = response.status || 'closed';
        this.newStatus = this.currentGymStatus;
        this.lastUpdated = response.last_updated || new Date().toLocaleString();
        this.errorMessage = '';
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load gym status';
        this.currentGymStatus = 'unknown';
        this.lastUpdated = '';
      }
    });
  }

  updateGymStatus(): void {
    if (!this.newStatus) {
      this.errorMessage = 'Please select a status';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateGymStatus(this.newStatus).subscribe({
      next: () => {
        this.isUpdating = false;
        this.currentGymStatus = this.newStatus;
        this.successMessage = `Gym status updated to "${this.newStatus}" successfully!`;
        this.lastUpdated = new Date().toLocaleString();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.detail || 'Failed to update gym status';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
