package com.mehdi.vCenter.Inventory.Manager.services;

import com.mehdi.vCenter.Inventory.Manager.entities.ChangementApplication;

import java.util.List;

public interface ChangementApplicationService {
    List<ChangementApplication> getAllChangements();
    ChangementApplication getChangementById(Long id);
    ChangementApplication  saveChangement(ChangementApplication changementApplication);
}
