package com.mehdi.vCenter.Inventory.Manager.repositories;


import com.mehdi.vCenter.Inventory.Manager.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Long> {
}
