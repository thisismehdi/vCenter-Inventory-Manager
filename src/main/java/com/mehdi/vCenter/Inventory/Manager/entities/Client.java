package com.mehdi.vCenter.Inventory.Manager.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String ste;
    private String userID;
    private String lastName;
    private Boolean notifier;
    @OneToMany
    private List<Vm> vm;
    @ManyToOne
    private Personne personne;

    public Client(Client client){
        this.setId(client.getId());
        this.setNom(client.getNom());
        this.setSte(client.getSte());
        this.setUserID(client.getUserID());
        this.setLastName(client.getLastName());
        this.setNotifier(client.getNotifier());
        this.setPersonne(client.personne);
    }
}
