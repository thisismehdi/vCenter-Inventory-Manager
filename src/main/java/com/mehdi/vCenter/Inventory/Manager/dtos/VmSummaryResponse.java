package com.mehdi.vCenter.Inventory.Manager.dtos;

import lombok.Data;

@Data
public class VmSummaryResponse {
    private int memory_size_MiB;
    private String vm;
    private String name;
    private String power_state;
    private int cpu_count;

}