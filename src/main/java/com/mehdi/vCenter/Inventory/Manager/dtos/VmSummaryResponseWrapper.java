package com.mehdi.vCenter.Inventory.Manager.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class VmSummaryResponseWrapper {
    private List<VmSummaryResponse> value;

}
