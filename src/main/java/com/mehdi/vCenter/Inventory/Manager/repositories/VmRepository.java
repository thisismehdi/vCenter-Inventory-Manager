package com.mehdi.vCenter.Inventory.Manager.repositories;

import com.mehdi.vCenter.Inventory.Manager.entities.Vm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VmRepository extends JpaRepository<Vm,Long> {
    List<Vm> findByClientId(Long clientId);

    /*@Query("SELECT v FROM Vm v WHERE v.client.id = :clientId")
    List<Vm> findByClientId(@Param("clientId") Long clientId);*/
}
