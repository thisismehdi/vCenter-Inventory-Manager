package com.mehdi.vCenter.Inventory.Manager.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String nom;
    private String fqdn;
    private String hostName;
    private String statut;
    private int vcpu;
    private int consumedMemory;
    private int assignedMemory;
    private Long assignedStorage;
    private int storageConsumed;
    private String operationSys;
    private String sqlLicence;
    private Boolean facturable;
    private Date dateAffectation;
    @ManyToOne
    private Client client;

    public Vm(Vm role) {
        this.setId(role.getId());
        this.setCode(role.getCode());
        this.setNom(role.getNom());
        this.setFqdn(role.getFqdn());
        this.setHostName(role.getHostName());
        this.setStatut(role.getStatut());
        this.setVcpu(role.getVcpu());
        this.setConsumedMemory(role.getConsumedMemory());
        this.setAssignedMemory(role.getAssignedMemory());
        this.setAssignedStorage(role.getAssignedStorage());
        this.setStorageConsumed(role.getStorageConsumed());
        this.setOperationSys(role.getOperationSys());
        this.setSqlLicence(role.getSqlLicence());
        this.setFacturable(role.getFacturable());
        this.dateAffectation = role.dateAffectation;
        if(role.client !=null)
            this.client = new Client(role.client);
    }
   /* public boolean eaquals(Vm vm){

    }*/
}
