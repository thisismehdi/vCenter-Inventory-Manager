export interface ChangementVCenter{
  id ?: number;
  date : Date;
  typeChangement : string;
  placeChangement : string;
  valeurChanger : string;
  section : string;
  nomClient : string;
  nomVm : string;
  ancienneDonnee : string;
  nouvelleDonnee: string;
  description: string;
}
