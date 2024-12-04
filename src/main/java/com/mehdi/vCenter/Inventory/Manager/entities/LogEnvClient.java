package com.mehdi.vCenter.Inventory.Manager.entities;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogEnvClient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private String typeChangement;
    private String nomClient;

    private String placeChangement;
    private String section;
    private String nomVm;
    private String ancienneDonnee;
    private String nouvelleDonnee;
    private String description;
    private String valeurChanger;
}
