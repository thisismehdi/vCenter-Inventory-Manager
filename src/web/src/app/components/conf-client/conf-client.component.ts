import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Vm} from "../../../../Entities/Vm.interface";
import {Personne} from "../../../../Entities/Personne.interface";
import {Client} from "../../../../Entities/Client.interface";
import {ClientService} from "../../../service/client.service";
import {vmService} from "../../../service/vm.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {PersonneService} from "../../../service/Personne.service";
import {NotificationService} from "../../../service/Notification.service";
import {ChangementAppService} from "../../../service/ChangementAppService";
import {ChangementApp} from "../../../../Entities/ChangementApp.interface";
import {DatePipe, registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";

@Component({
  selector: 'app-conf-client',
  templateUrl: './conf-client.component.html',
  styleUrls: ['./conf-client.component.css'],
  providers: [DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
   ]
})
export class ConfClientComponent implements OnInit {

  @ViewChild("pickerk")
  pickerk:any;
  selectedTable: string = 'VM non assignée';
  selectedDelivery :string ="delivery";
  selectedDelivery1 :string ="";
  notif:boolean=false;
  clients:Client[]=[];
  showForm: boolean = false;


  selectedDateRange: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  private filteredData: Client []=[];
  toggleForm() {
    this.showForm = true
    this.client = {
      id:0,
      nom: "",
      ste: "",
      userID : "",
      lastName :"",
      notifier: false,
      selectedDelivery:"",
      personne: {
        id : 0
      }
    };
    this.selectedDelivery='delivery';
    this.selectedDelivery1='';
  }
  vms: Vm[] =[];
  vmsAssi: Vm[] =[];
  filtreVmsAssi: Vm[] =[];
  filtreVmsAssiCl: Vm[] =[];
  delivery:Personne[]=[];
  emailDelivery!: string;
  selectedClient: string = "Sélectionner un client";
  sortVm: string="tri décroissant"
  vm : Vm={
    id: 0,
    code:"",
    nom: "",
    fqdn: "",
    hostName: "",
    statut: "",
    vcpu: 0,
    consumedMemory: 0,
    assignedMemory: 0,
    assignedStorage: 0,
    storageConsumed: 0,
    operationSys: "",
    sqlLicence: "",
    facturable: false,
    selected:false,
    selectedClientdelivery : "",
    selectedClient : "",
    client :{
      id : 0,
      nom: "",
      ste: "",
      userID : "",
      lastName :"",
      selectedDelivery:"",
      notifier: false,
      personne: {
        id : 0
      }
    },
    dateAffectation : new Date()
  }
  initialisation(){
    this.vm = {
      id: 0,
      code:"",
      nom: "",
      fqdn: "",
      hostName: "",
      statut: "",
      vcpu: 0,
      consumedMemory: 0,
      assignedMemory: 0,
      assignedStorage: 0,
      storageConsumed: 0,
      operationSys: "",
      sqlLicence: "",
      facturable: false,
      selected:false,
      selectedClientdelivery : "",
      selectedClient : "",
      client :{
        id : 0,
        nom: "",
        ste: "",
        userID : "",
        lastName :"",
        selectedDelivery:"",
        notifier: false,
        personne: {
          id : 0
        }
      },
      dateAffectation : new Date()
    }
  }
  client: Client = {
    id:0,
    nom: "",
    ste: "",
    userID : "",
    lastName :"",
    notifier: false,
    selectedDelivery:"",
    personne: {
      id : 0
    }
  };
  oldClient: Client = {
    id:0,
    nom: "",
    ste: "",
    userID : "",
    lastName :"",
    notifier: false,
    selectedDelivery:"",
    personne: {
      id : 0
    }
  };


  changement : ChangementApp = {
    date: new Date(),
    typeChangement: "",
    action: "",
    placeChangement: "",
    section: "",
    nomClient: "",
    nomVm: "",
    utilisateur: "",
    ancienneDonnee: "",
    nouvelleDonnee: "",
    description: ""
  }
  personne:Personne= {
  }
  private notificationService!: NotificationService;

  fetchDelivry(){
    this.http.get<Array<Personne>>('http://localhost:8080/personnes')
      .subscribe({
        next : data =>{
          this.delivery=data;
        },
      })
  }


  check(vm:Vm) {
    vm.selected=!vm.selected
  }
  constructor(private injector: Injector,private changementAppService : ChangementAppService ,private dateAdapter: DateAdapter<Date> ,public dialog: MatDialog,private http:HttpClient,private clientSerivce: ClientService,private vmService:vmService,private personneService : PersonneService) {
    registerLocaleData(localeFr);
    setTimeout(() => {
      this.notificationService = this.injector.get(NotificationService);
    });


  }

  ngOnInit() {
    this.fetchDelivry();
    this.fetchDataClient();
    this.fetchVMNonAssigne();
    this.fetchVMAssigne();
    /*this.vmService.getVmById(1).subscribe((data: Vm) => {
      console.log(data);
    },)*/
  }
  fetchDataClient(){
    this.clientSerivce.fetchDataClient()
      .subscribe({
        next : data =>{
          this.clients = data;
          this.filteredData = data;
          //console.log(data)
          for(let ref of this.clients){
            if(!ref.lastName)
              ref.lastName = ref.ste +"_MAINTENANCE";
            if(!ref.userID)
              ref.userID = ref.ste +"."+ ref.lastName;
            ref.modifier=false;
          }
        },
      })
  }

  fetchVMNonAssigne(){
    this.vmService.fetchDataClient().subscribe({
      next: data => {
        this.vms = data.filter(vm => vm.client == null).map(vm => ({
          ...vm,
          selectedClient: 'Sélectionner un client',
          isSelected : false
        }));
      },
      error: err => {
        console.error('Error fetching VMs', err);
      }
    });
  }
  fetchVMAssigne(){
    this.vmService.fetchDataClient()
      .subscribe({
        next: data => {
          this.vmsAssi = data.filter(vm => vm.client != null);
          this.filtreVmsAssi = this.vmsAssi
            .filter(vm => vm.dateAffectation) // Filtrer les VMs ayant une dateAffectation
            .sort((a, b) => {
              const dateA = new Date(a.dateAffectation);
              const dateB = new Date(b.dateAffectation);
              return dateB.getTime() - dateA.getTime();
            });
          this.filtreVmsAssiCl = this.filtreVmsAssi;
        },
        error: err => {
          console.error('Error fetching VMs', err);
        }
      });
  }

  onTableChange(tableName: string) {
    this.selectedTable = tableName;
  }

  getDataByTable(): any[] {
    switch (this.selectedTable) {
      case 'VM non assignée':
        return this.vms;
      case 'VM assignée':
        return this.vmsAssi;
      case 'Référentiel client':
        return this.filteredData;
      default:
        return [];
    }
  }
  onDeliveryChange(client: Client) {
    const selectedClientObject = this.delivery.find(personne => personne.prenom === client.personne.prenom);

    if ( selectedClientObject ){
      if (selectedClientObject.email != null) {
        client.selectedDelivery = selectedClientObject.email;
        this.selectedDelivery1 = selectedClientObject.email;
      }
      else {
        client.selectedDelivery='';
        this.personne.id = selectedClientObject.id;
        this.personne.nom = selectedClientObject.nom;
        this.personne.prenom = selectedClientObject.prenom;
      }
      this.client.personne.id = selectedClientObject.id;
    } else {
      client.selectedDelivery=" ";
    }
  }

  onClientChange(vm : Vm) {
    // vm.selected = true
    if (vm.selectedClient ) {
      const selectedClientObject = this.clients.find(client => client.nom === vm.selectedClient);
      // @ts-ignore
      this.vm.client.id = selectedClientObject.id;
      //console.log(selectedClientObject)
      if(selectedClientObject ){
        if (selectedClientObject.personne.email!=null)
          vm.selectedClientdelivery = selectedClientObject.personne.nom +" "+selectedClientObject.personne.prenom;
        else {
          vm.selectedClientdelivery='';
          this.personne.id = selectedClientObject.personne.id;
          this.personne.nom = selectedClientObject.personne.nom;
          this.personne.prenom = selectedClientObject.personne.prenom;
        }

      }
      else {
        vm.selectedClientdelivery=' ';
      }
    }
  }


  fact(vm:Vm) {
    vm.facturable=!vm.facturable
  }



  save(vm: Vm) {
    this.http.post<Vm>(`http://localhost:8080/vm/${vm.id}`,
      {vm}).subscribe(
      (newVm) => {
      },
    )
  }
  saveChangement(changement : ChangementApp){

    this.changementAppService.saveChangementApp(changement).subscribe(response => {
      console.log('ChangementApp : ', response);
    }, error => {
      console.error('Error saving ChangementApp', error);
    });
  }
  changementClient(client:Client){
    this.changement.typeChangement = 'Client';
    this.changement.action = 'Ajout';
    this.changement.placeChangement = 'Configuration';
    this.changement.section = 'Référence client';
    this.changement.nomClient = client.nom;
    this.changement.nomVm = '-';
    this.changement.utilisateur = 'tata';
    this.changement.ancienneDonnee = '-';
    this.changement.nouvelleDonnee = client.nom;
    this.changement.description = 'Ajout de client '+client.nom;
  }

  saveClient(){
    if(this.selectedDelivery1==''){
      this.personne.email = this.emailDelivery;
      console.log(this.personne);
      // @ts-ignore
      this.personneService.updatePersonne(this.personne.id,this.personne).subscribe(data => {
        this.fetchDelivry();
        this.fetchDataClient();
      }, error => console.log(error));
    }
    this.client.userID = this.client.ste + '.' + this.client.ste +'_MAINTENANCE';
    this.client.lastName = this.client.ste +'_MAINTENANCE';
    this.client.notifier = this.notif;
    this.clientSerivce.saveClient(this.client).subscribe(response => {
      //this.changementClient(this.client);
      //this.saveChangement(this.changement);
      this.notificationService.showSuccess(`Client ${this.client.nom} ajouter avec succès`);
      this.client.nom = '';
      this.client.lastName = '';
      this.client.userID = '';
      this.client.ste = '';
      this.client.personne.id=0;
      this.client.notifier = false;
      this.fetchDataClient();
      this.showForm=!this.showForm;
    }, error => {
      console.error('Error saving client:', error);
    });
  }


  notificationClick(client:Client) {
    client.notifier =! client.notifier
  }


  deleteClient(client:Client) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message:  `Voulez-vous supprimer ${client.nom}` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientSerivce.deleteClient(client.id).subscribe(
          () => {
            /* this.changementClient(client);
             this.changement.typeChangement = 'Suppression'
             this.changement.description = 'Suppression de client '+client.nom;
             this.changement.ancienneDonnee = client.nom ;
             this.changement.nouvelleDonnee = '-';
             this.saveChangement(this.changement);*/
            this.fetchDataClient();
            this.notificationService.showSuccess(`Client ${client.nom} supprimé avec succès`);
          },
          (error) => {
            //console.error('Error deleting ths client:', error);
            this.notificationService.showError('le client '+client.nom+' est affecter aux Vm')
          }
        );
      }
    });
  }

  modifyClient(client:Client){
    this.client.personne.id = client.personne.id;
    client.modifier=!client.modifier;
    this.notif = client.notifier;
    if(client.personne.prenom &&client.personne.email){
      this.selectedDelivery = client.personne.prenom;
      client.selectedDelivery = this.selectedDelivery1 = client.personne.email;
    }
    this.oldClient.nom = client.nom;
    this.oldClient.ste = client.ste;
    this.oldClient.lastName = client.lastName;
    this.oldClient.userID = client.userID;
    this.oldClient.id = client.id;
    this.oldClient.personne.id = client.personne.id;
    //this.oldClient.notifier = client.notifier;

  }

  description :string ="";

  detectChanges():string{
    // this.changementClient(this.client);
    //this.changement.action = 'Modification';
    this.vmService.getVMsByClientId(this.client.id).subscribe(data => {
      //this.vmNames = data.map(vm => vm.nom);
      if (this.oldClient.nom != this.client.nom) {
        // description = 'changment le nom de client de ' + this.oldClient.nom + ' à ' + this.client.nom;
        this.description = 'Le nom de client "' + this.oldClient.nom + '" à été bien modifié';
        //this.saveChangement(this.changement);
        //console.log(this.vmNames)
        /*for(let vm of this.vmNames){
          this.changement.nomVm = vm;
          this.saveChangement(this.changement);
        }*/
      }
      //this.changementClient(this.client);
      //  this.changement.action = 'Modification';
      if(this.oldClient.ste != this.client.ste){
        /*  this.changement.typeChangement = 'STE';
          this.changement.ancienneDonnee = this.oldClient.ste;
          this.changement.nouvelleDonnee = this.client.ste;
          this.changement.description = 'changment de STE de client de '+this.oldClient.ste+' à '+this.client.ste;*/
        this.description = 'Le STE de client "'+this.oldClient.ste+'" à été bien modifié';
        //this.saveChangement(this.changement);
        /*for(let vm of this.vmNames){
         this.changement.nomVm = vm;
          this.saveChangement(this.changement);
         // console.log(this.changement)
        }*/
      }

      if(this.oldClient.notifier != this.client.notifier){
        this.description =this.client.notifier ? 'Le delivery de client "'+this.oldClient.ste+'" sera notifié':'Le delivery de client "'+this.oldClient.ste+'" sera non notifié';
      }
      if(this.oldClient.personne.id != this.client.personne.id){
        this.description = 'Le delivery de client "'+this.oldClient.ste+'"  a été bien modifié';
      }

    });
    return this.description;
  }
  intitClient(){
    this.client = {
      id: 0,
      nom: "",
      ste: "",
      userID: "",
      lastName: "",
      notifier: false,
      selectedDelivery: "",
      personne: {
        id: 0
      }
    }
  }

  saveModifyClient(client: Client) {
    // this.intitClient();
    if(client.personne.prenom!='delivery'){
      if (client.selectedDelivery == '') {
        this.personne.email = this.emailDelivery;
        console.log(this.personne);
        // @ts-ignore
        this.personneService.updatePersonne(this.personne.id, this.personne).subscribe(data => {
          this.fetchDelivry();
        }, error => console.log(error));
      }

      console.log(this.client);
      console.log(client);
      this.client.id = client.id;
      this.client.nom = client.nom;
      this.client.ste = client.ste;
      this.client.userID = this.client.ste + '.' + this.client.ste + '_MAINTENANCE';
      this.client.lastName = this.client.ste + '_MAINTENANCE';
      this.client.notifier = client.notifier;
      console.log("old: "+ client.notifier);
      //if(client.notifier)
      // this.client.notifier=client.notifier;
      if (client.id) {
        this.clientSerivce.updateClient(client.id, this.client).subscribe(data => {
          //this.detectChanges();

          this.fetchDataClient();
          this.fetchVMAssigne();
          //if(this.description!="")
          this.notificationService.showSuccess(`Client "${client.nom}" mis à jour avec succès`);
          client.modifier = !client.modifier;
        }, error => console.log(error));
      }
    }else {
      this.notificationService.showError('Les informations sont inccorecte');
    }
  }

  notificationClickSave() {
    this.notif = ! this.notif;
  }
  copy(vm:Vm){
    this.vm.id = vm.id;
    this.vm.code = vm.code;
    this.vm.nom = vm.nom;
    this.vm.fqdn = vm.fqdn;
    this.vm.hostName = vm.hostName;
    this.vm.statut = vm.statut;
    this.vm.vcpu = vm.vcpu;
    this.vm.consumedMemory = vm.consumedMemory;
    this.vm.assignedMemory = vm.assignedMemory;
    this.vm.assignedStorage = vm.assignedStorage;
    this.vm.storageConsumed = vm.storageConsumed;
    this.vm.operationSys = vm.operationSys;
    this.vm.sqlLicence = vm.sqlLicence;
    this.vm.facturable = vm.facturable;

  }
  //Save Vm


  affectation(vm: Vm){
    if(vm.selectedClient!='Sélectionner un client'){
      //this.initialisation();
      this.copy(vm);
      this.vmService.affectation(vm.id, this.vm).subscribe(data => {
        /*this.changementClient(this.client);
        this.changement.action = 'Modification';
        this.changement.nomClient = vm.selectedClient;
        this.changement.description='affectation de vm '+vm.nom+' a client '+vm.selectedClient;
        this.changement.typeChangement='VM';
        this.changement.nomVm=vm.nom;
        this.changement.section='VM non assignée';
        this.saveChangement(this.changement);*/
        this.fetchVMNonAssigne();
        this.fetchVMAssigne();
        this.notificationService.showSuccess('Le Vm "'+vm.nom + '" a été assingé au client "'+ vm.selectedClient+ '" avec succès');
      }, error => console.log(error));
    }
    else{
      this.notificationService.showError('Sélectionner un client');
    }
  }

  deleteVm(vm: Vm) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Voulez-vous supprimer ${vm.nom}` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(vm.id)
        this.vmService.deleteVm(vm.id).subscribe(
          () => {
            /* this.changementClient(this.client);
             this.changement.typeChangement = 'Vm';
             this.changement.action = 'Suppression';
             this.changement.section = 'Vm non assignée client';
             this.changement.nomClient = '';
             this.changement.nomVm = vm.nom;
             this.changement.typeChangement = 'Suppression';
             this.changement.description = 'Suppression de vm ' + vm.nom;
             this.changement.ancienneDonnee = '-';
             this.changement.nouvelleDonnee = '-';
             this.changement.nomClient = '-';
             this.saveChangement(this.changement);*/
            this.notificationService.showSuccess('Le VM supprimé avec succès');
            this.fetchVMNonAssigne();
          },
          (error) => {
            console.error('Error deleting vm:', error);
            this.notificationService.showError('Erreur lors de la suppression du VM. Veuillez réessayer.');
          }
        );
      }
    });
  }


  factorableVmAssi(vm: Vm): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: vm.facturable ? `Voulez-vous rendre ${vm.nom} non facturable` : `Voulez-vous rendre ${vm.nom} facturable` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.copy(vm);
        // @ts-ignore
        this.vm.client.id = vm.client.id;
        this.vm.facturable = !this.vm.facturable;
        this.vmService.affectation(vm.id,this.vm).subscribe(data => {
          this.fetchVMAssigne();
          this.fetchVMNonAssigne();
          const message = vm.facturable ? `Le "${vm.nom}" non facturable` : `Le Vm "${vm.nom}" facturable`
          this.notificationService.showSuccess(message);
        }, error => console.log(error));
      }
    });
  }
  deleteVmAssi(vm : Vm){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Voulez-vous supprimer ${vm.nom} du client ${vm.client?.nom}` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.copy(vm);
        // @ts-ignore
        this.vm.client=null;
        this.vmService.affectation(vm.id,this.vm).subscribe(data => {
          this.fetchVMAssigne();
          this.fetchVMNonAssigne();
          this.notificationService.showSuccess('Le VM supprimé avec succès');
          this.initialisation();
        }, error => console.log(error));
      }
    });
  }

  onDeliveryChangeAjout() {
    const selectedClientObject = this.delivery.find(personne => personne.prenom === this.selectedDelivery);
    if( selectedClientObject ){
      if (selectedClientObject.email != null) {
        this.selectedDelivery1 = selectedClientObject.email;
      }
      else {
        this.selectedDelivery1='';
        this.personne.id = selectedClientObject.id;
        this.personne.nom = selectedClientObject.nom;
        this.personne.prenom = selectedClientObject.prenom;
      }
      this.client.personne.id = selectedClientObject.id;
    } else {
      this.selectedDelivery1=" ";
    }
  }

  filterClient(clientName : string) {
    if (clientName === 'Sélectionner un client') {
      this.filteredData = this.clients;
    } else {
      this.filteredData = this.clients.filter(row => row.nom === clientName);
    }
  }


  cancel() {
    this.showForm = !this.showForm;
  }

  cancelFiltre() {
    this.filteredData = this.clients;
    this.selectedClient = 'Sélectionner un client';
    this.filtreVmsAssi = this.vmsAssi;
  }

  //pagination
  currentPage = 1;
  itemsPerPage = 8;
  get paginatedVMs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.vms.slice(start, end);
  }


  totalPages() {
    return Math.ceil(this.vms.length / this.itemsPerPage);
  }
  setPage(page: number) {
    this.currentPage = page;
  }

  filterClient1(clientName : string) {
    if (clientName === 'Sélectionner un client') {
      this.filtreVmsAssi = this.vmsAssi;
    } else {
      this.filtreVmsAssi = this.filtreVmsAssi.filter(row => row.client?.nom === clientName);
    }
  }

  sortVmFun($event: any) {
    if(this.sortVm ==='tri décroissant'){
      this.filtreVmsAssi = this.filtreVmsAssi
        .filter(vm => vm.dateAffectation)
        .sort((a, b) => {
          const dateA = new Date(a.dateAffectation);
          const dateB = new Date(b.dateAffectation);
          return dateB.getTime() - dateA.getTime();
        });
    }
    else if(this.sortVm ==='tri croissant'){
      this.filtreVmsAssi = this.filtreVmsAssi
        .filter(vm => vm.dateAffectation)
        .sort((a, b) => {
          const dateA = new Date(a.dateAffectation);
          const dateB = new Date(b.dateAffectation);
          return dateA.getTime() - dateB.getTime();
        });
    }
  }

  cancelSort() {
    this.filtreVmsAssi = this.filtreVmsAssi
      .filter(vm => vm.dateAffectation)
      .sort((a, b) => {
        const dateA = new Date(a.dateAffectation);
        const dateB = new Date(b.dateAffectation);
        return dateB.getTime() - dateA.getTime();
      });
    this.sortVm = 'tri décroissant';
  }


  clearDateRange() {
    this.startDate = null;
    this.endDate = null;
    this.selectedDateRange = null;
    this.filtreVmsAssi = this.vmsAssi;
    this.filtreVmsAssiCl = this.filtreVmsAssi;
  }

  //calendar 2

  onDateRangeSelected() {
    if (this.startDate && this.endDate) {
      // Format the dates
      const startDateFormatted = this.dateAdapter.format(this.startDate, 'input');
      const endDateFormatted = this.dateAdapter.format(this.endDate, 'input');
      this.selectedDateRange = `${startDateFormatted} - ${endDateFormatted}`;
      this.filterRolesByDateRange1(this.startDate, this.endDate);
    }
  }
  filterRolesByDateRange1(startDate: Date, endDate: Date) {
    this.filtreVmsAssi = this.filtreVmsAssi.filter(role => {
      const roleDate = new Date(role.dateAffectation);
      console.log(roleDate)
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const roleFormattedDate = new Date(roleDate.getFullYear(), roleDate.getMonth(), roleDate.getDate());
      console.log(roleFormattedDate >= start && roleFormattedDate <= end)
      return roleFormattedDate >= start && roleFormattedDate <= end;
    });
  }

  cacelAll(){
    this.clearDateRange();
    this.cancelFiltre();
    this.cancelSort();

  }
}
