package com.mehdi.vCenter.Inventory.Manager.services;

import com.mehdi.vCenter.Inventory.Manager.entities.Personne;

import java.util.List;

public interface PersonneService {
    List<Personne> getAllPersonnes();
    Personne getPersonneById(Long personneId);

    Personne savePersonne(Personne personne);
    Personne updatePersonne(Long id,Personne personne);

}
