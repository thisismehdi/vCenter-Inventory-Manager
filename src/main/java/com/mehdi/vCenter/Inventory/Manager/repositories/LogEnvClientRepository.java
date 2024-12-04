package com.mehdi.vCenter.Inventory.Manager.repositories;

import com.mehdi.vCenter.Inventory.Manager.entities.LogEnvClient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogEnvClientRepository extends JpaRepository<LogEnvClient,Long> {
}
