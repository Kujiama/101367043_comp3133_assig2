import { Component } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { EmployeesService } from '../gql/employees.service'

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
})

export class EmployeeListComponent {

  employees: Employee[] = [];

  constructor(private employeesService: EmployeesService) { }

  async ngOnInit() {
    const employeeList = await this.employeesService.getAllEmployees()
    employeeList.subscribe(employees => {
      this.employees = employees;
    });
  }

}
