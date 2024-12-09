import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Client} from "../../Entities/Client.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
  }

  saveClient(client: Client) {
    return this.http.post('http://localhost:8080/client', client);
  }

  deleteClient(clientId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/client/${clientId}`);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`http://localhost:8080/client/${id}`, client);
  }
  fetchDataClient(): Observable<Client[]>{
    return this.http.get<Array<any>>("http://localhost:8080/clients");
  }
}
