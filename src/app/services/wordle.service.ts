import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordleService {

  constructor(private http: HttpClient) {}

  wordle(letters:string[]): Observable<any> {
    return this.http.post(environment.url + "/wordle", {letters: letters})
  }
}
