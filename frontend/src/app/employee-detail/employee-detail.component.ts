import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../interfaces/employee';
import { EmployeesService } from '../gql/employees.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit{

  employee: Employee = {
    id:'',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    salary: 0
  };

  constructor(private route: ActivatedRoute, private employeeService: EmployeesService) { }

  async ngOnInit() {
    // Get the employee id from the route /details/:id
    const empID = this.route.snapshot.params['empID'];

    // Fetch the employee details
    const employee = await this.employeeService.getEmployeeWithId(empID);
    employee.subscribe((employee:Employee) => {
      this.employee = employee;
    });
  }
}
