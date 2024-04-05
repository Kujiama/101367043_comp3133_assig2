import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../gql/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { UserResponse } from '../interfaces/user'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private usersService: UsersService, private router:Router) {}
  
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.usersService.login(this.loginForm.value.username, this.loginForm.value.password).pipe(
        catchError(error => {
          // It's better to use a more user-friendly message display, like a toast or snackbar.
          alert("Failed to login. Please check your credentials and try again.");
          console.error("Error logging in:", error);
          return of(null); // You might want to return an Observable of type 'UserResponse' here with a message indicating the error.
        })
      ).subscribe((response: UserResponse | null) => {
        if (response && response.user) {
          // Assuming 'response.message' contains a success message
          alert(response.message); // 'response.message' for the message, not 'response.login.message'
          // Handle success, such as storing the user details and navigating to a dashboard
          this.loginForm.reset();
        } else {
          // Handle the case where the response does not contain the expected 'user' field
          alert("Failed to login. Please check your credentials and try again.");
        }
      });
    } else {
      alert("Please fill in all the fields");
    }
  }
}
