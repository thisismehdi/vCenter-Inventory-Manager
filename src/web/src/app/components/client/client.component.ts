import {Component, OnInit} from '@angular/core';
import {MsalService} from "@azure/msal-angular";
import {Client} from "../../../../Entities/Client.interface";
import {SearchService} from "../../../service/SearchService.service";
import {ClientService} from "../../../service/client.service";
import {vmService} from "../../../service/vm.service";
import {Vm} from "../../../../Entities/Vm.interface";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit{
  clientList :Array<Client> = [];
  vms :Vm[] | undefined = [];
  searchQuery: string = '';

  filteredClients: Client[] = [];
  filteredClientsVm: Client[] = [];
  constructor(private clientService :ClientService,private searchService: SearchService,private authService: MsalService,private vm : vmService) {
  }
  test(){
    if (this.isLoggedIn()) {
      console.log('User is connected');
    } else {
      console.log('User is not connected');
    }
  }
  ngOnInit(): void {
    this.test();
    this.getClients();
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filter();
    });

  }
  filter() {
    this.filteredClients = this.clientList.filter(client =>
      client.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(this.filteredClients)
  }
  getClients(){
    this.clientService.fetchDataClient()
      .subscribe({
        next : data =>{
          this.clientList = data;
          this.filteredClients = data;
          //console.log(this.clientList);
        },
      })
  }
  /*getClientVm(id: number): Promise<boolean> {
    return this.vm.getVMsByClientId(id).toPromise().then(data => {
      this.vms = data;
      //console.log(this.vms)
      // @ts-ignore
      return this.vms.length > 0;
    });
  }*/
  filterClient(){
  }
  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null
  }
}
