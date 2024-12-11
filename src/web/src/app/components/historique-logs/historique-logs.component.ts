import {Component, OnInit} from '@angular/core';
import {ChangementAppService} from "../../../service/ChangementAppService";
import {ChangementApp} from "../../../../Entities/ChangementApp.interface";
import {DatePipe} from "@angular/common";
import * as XLSX from "xlsx";
import {ChangementVCenter} from "../../../../Entities/ChangementVCenter.interface";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";

@Component({
  selector: 'app-historique-logs',
  templateUrl: './historique-logs.component.html',
  styleUrls: ['./historique-logs.component.css'],
  providers: [DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class HistoriqueLogsComponent implements OnInit{
  selectedTable: string = 'Changements environnement client';
  changements : ChangementApp[]=[];
  changementsClient : ChangementVCenter[]=[];
  filteredChangements : ChangementApp[]=[];
  filteredChangementsClient : ChangementVCenter[]=[];
  filteredSearch : ChangementApp[]=[];
  clientNames: string[] = [];
  selectedClient: string='Sélectionner un client';
  searchTerm: string = '';
  searchTerm2: string = '';
  selectedDateRange: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  constructor(private serviceChangementApp : ChangementAppService, private dateAdapter: DateAdapter<Date>) {
  }
  selectedDate: string | null = null;

  onTableChange(tableName: string) {
    this.selectedTable = tableName;
    this.selectedClient = 'Sélectionner un client';
    this.filteredChangementsClient = this.changementsClient;
    this.filteredChangements = this.changements;
    this.selectedDate = ""
    this.clearDateRange();
  }

  fetchChangementClient(){
    this.serviceChangementApp.getChangementClient().subscribe({
      next : data =>{
        this.changementsClient=data;
        // @ts-ignore
        this.changementsClient.sort((a, b) =>   new Date(b.date) - new Date(a.date));
        this.filteredChangementsClient = this.changementsClient;
      },
    })
  }

  fetchChangement(){
    this.serviceChangementApp.getChangement().subscribe({
      next : data =>{
        this.changements=data;
        // @ts-ignore
        this.changements.sort((a, b) =>   new Date(b.date) - new Date(a.date));
        //console.log(this.changements);
        this.getClientNames();
        this.filteredChangements = this.changements;
        this.filteredSearch = this.changements;
      },
    })
  }
  getClientNames() {
    const uniqueClientNames = [...new Set(
      this.changements
        .map(changement => changement.nomClient)
        .filter(nomClient => nomClient !== '-')
    )];
    this.clientNames = uniqueClientNames;
    this.clientNames.push('-');
  }
  filterTableByClient(event: Event) {
    const selectedClient = (event.target as HTMLSelectElement).value;
    if (selectedClient) {
      this.filteredChangements = this.filteredChangements.filter(changement => changement.nomClient === selectedClient);
    } else {
      this.filteredChangements = this.changements;
    }
  }
  filterTableCientByClient(event: Event) {
    const selectedClient = (event.target as HTMLSelectElement).value;
    if (selectedClient) {
      this.filteredChangementsClient = this.changementsClient.filter(changement => changement.nomClient === selectedClient);
    } else {
      this.filteredChangementsClient = this.changementsClient;
    }

  }
  cancelFiltre() {
    this.filteredChangements = this.changements;
    this.selectedClient = 'Sélectionner un client';
  }
  cancelFiltreClient() {
    this.filteredChangementsClient = this.changementsClient;
    this.selectedClient = 'Sélectionner un client';
  }

  filterSearch() {
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower) {
      this.filteredChangements = this.changements.filter(changement =>
        changement.action.toLowerCase().includes(searchTermLower) ||
        changement.placeChangement.toLowerCase().includes(searchTermLower) ||
        changement.nomVm.toLowerCase().includes(searchTermLower) ||
        changement.utilisateur.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredChangements = this.changements;
    }
  }

  filterSearch2() {

    const searchTermLower = this.searchTerm2.toLowerCase();
    if (searchTermLower) {

      this.filteredChangementsClient = this.changementsClient.filter(changement =>
        changement.typeChangement.toLowerCase().includes(searchTermLower) ||
        changement.nomVm.toLowerCase().includes(searchTermLower) ||
        changement.ancienneDonnee.toLowerCase().includes(searchTermLower) ||
        changement.nouvelleDonnee.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredChangementsClient = this.changementsClient;
    }
  }
  ngOnInit(): void {
    this.fetchChangement();
    this.fetchChangementClient();
  }

  //Historique pagination

  currentPage = 1;
  itemsPerPage = 3;
  get paginated() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.changements.slice(start, end);
  }


  totalPages() {
    return Math.ceil(this.changements.length / this.itemsPerPage);
  }
  setPage(page: number) {
    this.currentPage = page;
  }
//export to excel
  exportexcel(): void {
    // Transform dates to a simple format
    const transformedChangements = this.filteredChangements.map(changement => ({
      ...changement,
      date: new Date(changement.date).toISOString().split('T')[0] // Simplify the date format
    }));

    // Remove the ID field from the data
    const dataWithoutID = transformedChangements.map(changement => {
      const { id, ...rest } = changement;
      return rest;
    });

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutID);

    // Apply bold font to header cells
    const range: XLSX.Range = XLSX.utils.decode_range(<string>ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerAddress: string = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      if (!ws[headerAddress]) continue;
      const headerCell = ws[headerAddress] as XLSX.CellObject;
      headerCell.s = { font: { bold: true } }; // Apply bold font
    }

    // Create workbook and append worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    if(this.selectedClient!='Sélectionner un client')
      XLSX.writeFile(wb, this.selectedClient+"_logs.xlsx");
    else if(this.selectedDate!='')
      XLSX.writeFile(wb, "le"+ this.selectedDate+"_logs.xlsx");
    else
      XLSX.writeFile(wb, "changement_application.xlsx");
  }


  exportexcel2(): void {
    // Transform dates to a simple format
    const transformedChangements = this.filteredChangementsClient.map(changement => ({
      ...changement,
      date: new Date(changement.date).toISOString().split('T')[0] // Simplify the date format
    }));

    // Remove the ID field from the data
    const dataWithoutID = transformedChangements.map(changement => {
      const { id, ...rest } = changement;
      return rest;
    });

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutID);

    // Apply bold font to header cells
    const range: XLSX.Range = XLSX.utils.decode_range(<string>ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerAddress: string = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      if (!ws[headerAddress]) continue;
      const headerCell = ws[headerAddress] as XLSX.CellObject;
      headerCell.s = { font: { bold: true } }; // Apply bold font
    }

    // Create workbook and append worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export workbook to Excel file
    if(this.selectedClient!='Sélectionner un client')
      XLSX.writeFile(wb, this.selectedClient+"_logs.xlsx");
    else if(this.selectedDate!='')
      XLSX.writeFile(wb, "le"+ this.selectedDate+"_logs.xlsx");
    else
      XLSX.writeFile(wb, "changement_application.xlsx");
  }

  //Calendar
  onDateRangeSelected() {
    if (this.startDate && this.endDate) {
      // Format the dates
      const startDateFormatted = this.dateAdapter.format(this.startDate, 'input');
      const endDateFormatted = this.dateAdapter.format(this.endDate, 'input');
      this.selectedDateRange = `${startDateFormatted} - ${endDateFormatted}`;
      this.filterRolesByDateRange(this.startDate, this.endDate);
    }
  }

  filterRolesByDateRange(startDate: Date, endDate: Date) {
    this.filteredChangements = this.changements.filter(role => {
      const roleDate = new Date(role.date);
      console.log(roleDate)
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const roleFormattedDate = new Date(roleDate.getFullYear(), roleDate.getMonth(), roleDate.getDate());
      console.log(roleFormattedDate >= start && roleFormattedDate <= end)
      return roleFormattedDate >= start && roleFormattedDate <= end;
    });
  }

  clearDateRange() {
    this.startDate = null;
    this.endDate = null;
    this.selectedDateRange = null;
    this.filteredChangements = this.changements;
    this.filteredChangementsClient=this.changementsClient;
  }

  //calendar 2
  onDateRangeSelected1() {
    if (this.startDate && this.endDate) {
      // Format the dates
      const startDateFormatted = this.dateAdapter.format(this.startDate, 'input');
      const endDateFormatted = this.dateAdapter.format(this.endDate, 'input');
      this.selectedDateRange = `${startDateFormatted} - ${endDateFormatted}`;
      this.filterRolesByDateRange1(this.startDate, this.endDate);
    }
  }

  filterRolesByDateRange1(startDate: Date, endDate: Date) {
    this.filteredChangementsClient = this.changementsClient.filter(role => {
      const roleDate = new Date(role.date);
      console.log(roleDate)
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const roleFormattedDate = new Date(roleDate.getFullYear(), roleDate.getMonth(), roleDate.getDate());
      console.log(roleFormattedDate >= start && roleFormattedDate <= end)
      return roleFormattedDate >= start && roleFormattedDate <= end;
    });
  }


}
