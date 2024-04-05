export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    // gender has 3 options [Male,Female,Other]
    gender: string;
    salary: number;
}

export interface newEmployee {
    firstName: string;
    lastName: string;
    email:string;
    gender: string;
    salary: number;
}


export interface EmployeeResponse {
    message: string;
    employee: Employee;
}