export interface ChangementApp{
  id ?: number;
  date : Date;
  typeChangement : string;
  action : string;
  placeChangement : string;
  section : string;
  nomClient : string;
  nomVm : string;
  utilisateur : string;
  ancienneDonnee : string;
  nouvelleDonnee: string;
  description: string;
}
