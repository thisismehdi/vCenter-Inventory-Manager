package com.mehdi.vCenter.Inventory.Manager.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String email;

    public Personne(Personne personne){
        this.setId(personne.getId());
        this.setNom(personne.getNom());
        this.setPrenom(personne.getPrenom());
        this.setEmail(personne.getEmail());
    }
}
