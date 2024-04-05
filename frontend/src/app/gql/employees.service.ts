// after using ng add apollo-angular we create a service to fetch data from the GraphQL server
// we use the Apollo service to make queries to the GraphQL server
// we inject the Apollo service into the service
// we define a query to fetch all employees from the GraphQL server

import { Injectable } from '@angular/core';
import { Apollo, gql} from 'apollo-angular';
import { Employee , EmployeeResponse} from '../interfaces/employee';
import { Observable } from 'rxjs'; //Observable is a class that represents a stream of data
import { map } from 'rxjs/operators'; //map is an operator that allows us to transform the data in the stream

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  getAllEmployeesQuery = gql`
    query{
      employees {
        id
        lastName
        firstName
        email
        gender
        salary
      }
    }
  `;

  getEmployeeWithIdQuery = gql`
    query EmployeeById($empId: String!) {
      employeeById(id: $empId) {
        id
        lastName
        firstName
        email
        gender
        salary
      }
    }
  `;

  addNewEmployeeMutation = gql`
    mutation AddEmployee($firstName: String!, $email: String!, $gender: String!, $salary: Float!, $lastName: String!) {
      addEmployee(firstName: $firstName, email: $email, gender: $gender, salary: $salary, lastName: $lastName) {
        message
        employee {
          id
          firstName
          lastName
          email
          gender
          salary
        }
      }
    }
  `;

  deleteEmployeeMutation = gql`
    mutation Mutation($deleteEmployeebyIdId: ID!) {
      deleteEmployeebyId(id: $deleteEmployeebyIdId) {
        message
      }
    }
  `;


  //with the Apollo service injected, we can now use it to make queries to the GraphQL server
  constructor(private apollo: Apollo) {}

  // observable is a class that represents a stream of data
  // in this case the output of the query is a stream of data
  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<{ employees: Employee[] }>({
      query: this.getAllEmployeesQuery
    }).valueChanges.pipe(
      map(result => result.data.employees)
    );
  }

  // getEmployeeWithId
  getEmployeeWithId(empId: string): Observable<Employee> {
    return this.apollo.watchQuery<{ employeeById: Employee }>({
      query: this.getEmployeeWithIdQuery,
      variables: {
        // id : empId when using this it does not work
        empId // empId is the variable that we pass to the query
        //$empId we use the $ sign to indicate that this is the value of the variable
      }
    }).valueChanges.pipe(
      map(result => result.data.employeeById)
    );
  }

  // addEmployee
  addEmployee(newEmp: Employee): Observable<any> {
    return this.apollo.mutate<EmployeeResponse>({
      mutation: this.addNewEmployeeMutation,
      variables: {
        firstName: newEmp.firstName,
        lastName: newEmp.lastName,
        email: newEmp.email,
        gender: newEmp.gender,
        salary: newEmp.salary
      }
    }).pipe(
      map(result => result.data)
    );
  }

  //delete employee
  deleteEmployee(empId: string): Observable<any> {
    return this.apollo.mutate<Employee>({
      mutation: this.deleteEmployeeMutation,
      variables: {
        empId
      }
    }).pipe(
      map(result => result.data)
    );
  }

}
