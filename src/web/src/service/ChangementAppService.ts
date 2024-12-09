import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ChangementApp} from "../../Entities/ChangementApp.interface";
import {Observable} from "rxjs";
import {ChangementVCenter} from "../../Entities/ChangementVCenter.interface";
@Injectable({
  providedIn: 'root'
})
export class ChangementAppService{

  constructor(private http: HttpClient) {
  }
  saveChangementApp(changementApp : ChangementApp): Observable<ChangementApp> {
    return this.http.post<ChangementApp>('http://localhost:8080/changementApp',changementApp);
  }
  getChangement():Observable<ChangementApp[]>{
    return this.http.get<Array<ChangementApp>>("http://localhost:8080/changementsApp");
  }
  getChangementClient():Observable<ChangementVCenter[]>{
    return this.http.get<Array<ChangementVCenter>>("http://localhost:8080/logs");
  }

}
