import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Personne} from "../../Entities/Personne.interface";

@Injectable({
  providedIn: 'root'
})
export class PersonneService{
  constructor(private http: HttpClient) {
  }
  updatePersonne(id: number, personne: Personne): Observable<Personne> {
    return this.http.put<Personne>(`http://localhost:8080/personne/${id}`, personne);
  }
}
