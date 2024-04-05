import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeesService } from '../gql/employees.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../interfaces/employee';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {

  updateEmployeeForm: FormGroup; // Removed the '!' for better initialization handling

  employeeID: string = "";
  genderList: string[] = ["Male", "Female", "Other"];

  constructor(private employeesService: EmployeesService, private route: ActivatedRoute) {
    // Initialize the FormGroup here to ensure it's always defined
    this.updateEmployeeForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      gender: new FormControl(''),
      salary: new FormControl(0)
    });
  }

  ngOnInit() {
    // Fetch the employeeID from the route
    this.employeeID = this.route.snapshot.params['empID'];
    // Now, fetch and populate the employee details
    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    if (!this.employeeID) {
      console.error('Employee ID is not available');
      return;
    }
    this.employeesService.getEmployeeWithId(this.employeeID).subscribe({
      next: (employee: Employee) => {
        this.updateEmployeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          gender: employee.gender,
          salary: employee.salary
        });
      },
      error: (error) => console.error('Error fetching employee data:', error)
    });
  }

  updateEmployee() {
    if (!this.employeeID) {
      console.error('Employee ID is not available');
      return;
    }
    this.employeesService.updateEmployee(this.employeeID, this.updateEmployeeForm.value)
      .pipe(
        catchError((error) => {
          console.error("Error updating employee:", error);
          alert("Failed to update employee due to an error.");
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          // Adjusted to match the mutation response structure
          if (response && response.data.updateEmployeebyId) {
            alert("Employee updated successfully");
            // Handle success, such as navigating away or updating the UI
          } else {
            // Handle case where response doesn't have the expected structure
            console.error('Unexpected response structure:', response);
            alert("Failed to update employee due to unexpected response structure.");
          }
        },
        error: (error) => {
          // Handle the case where the GraphQL request itself fails
          console.error('Error updating employee:', error);
          alert("Failed to update employee due to an error.");
        }
      });
  }
}
