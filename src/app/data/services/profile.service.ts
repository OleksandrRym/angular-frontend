import {inject, Injectable} from '@angular/core';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';
import {userInfo} from 'node:os';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = 'http://localhost:8080/pp';
  http = inject(HttpClient)

  getTestAccounts()  {
    return this.http.get<Profile[]>(`${this.baseUrl}/users`);
  }
  getMe(){
    return this.http.get<Profile>(`${this.baseUrl}/me`);
  }
}
