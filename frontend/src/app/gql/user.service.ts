import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User , UserResponse} from '../interfaces/user';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getAllUsersQuert = gql`
      query Users {
      users {
        id
        email
        password
        username
      }
    }
  `;

  loginQuery = gql`
      query Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        message
        user {
          id
          password
          email
          username
        }
      }
    }
  `
  
  signUpQuery = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password) {
        message
        user {
          id
          email
          username
          password
        }
      }
    }
  `;

  constructor(private apollo: Apollo) { }

  //getting all users
  getAllUsers(): Observable<User[]> {
    return this.apollo.watchQuery<{ users: User[] }>({
      query: this.getAllUsersQuert
    }).valueChanges.pipe(
      map(result => result.data.users)
    );
  }

  //login
  login(username: string, password: string): Observable<UserResponse> {
    return this.apollo.watchQuery<UserResponse>({
      query: this.loginQuery,
      variables: {
        username,
        password
      }
    }).valueChanges.pipe(
      map(result => result.data)
    );
  }
  
  //signUp
  
  
}