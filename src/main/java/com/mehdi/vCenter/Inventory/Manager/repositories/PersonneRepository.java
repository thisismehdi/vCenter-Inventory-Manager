package com.mehdi.vCenter.Inventory.Manager.repositories;

import com.mehdi.vCenter.Inventory.Manager.entities.Personne;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonneRepository extends JpaRepository<Personne,Long> {
}
