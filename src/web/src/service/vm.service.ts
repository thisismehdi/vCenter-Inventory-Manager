import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Vm} from "../../Entities/Vm.interface";

@Injectable({
  providedIn: 'root'
})
export class vmService{

  constructor(private http: HttpClient) {
  }
  fetchDataClient(): Observable<Vm[]>{
    return this.http.get<Array<Vm>>('http://localhost:8080/vms')
  }
  affectation(id:number ,vm: Vm) {
    return this.http.put<Vm>(`http://localhost:8080/vm/${id}`, vm);
  }

  deleteVm(vmId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vm/{id}?id=${vmId}`);
  }

  getVmById(vmId : number):Observable<Vm>{
    return this.http.get<Vm>(`http://localhost:8080/vm/{vmId}?vmId=${vmId}`);
  }
  getVMsByClientId(clientId : number) : Observable<Vm[]>{
  return this.http.get<Array<Vm>>(`http://localhost:8080/vmClient/${clientId}`)
  }

}
