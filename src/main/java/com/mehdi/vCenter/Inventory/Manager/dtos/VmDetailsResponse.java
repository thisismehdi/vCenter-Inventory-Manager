package com.mehdi.vCenter.Inventory.Manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VmDetailsResponse {
    private VmDetails value;

    @Data
    public static class VmDetails {
        private Memory memory;
        private List<Disk> disks;
        private Cpu cpu;
        private String name;
        private String guest_OS;
        private List<Nic> nics;
        private String power_state;

        @Data
        public static class Memory {
            private int size_MiB;
        }

        @Data
        public static class Disk {
            private DiskValue value;

            @Data
            public static class DiskValue {
                private long capacity;
                private Backing backing;

                @Data
                public static class Backing {
                    private String vmdk_file;
                }
            }
        }

        @Data
        public static class Cpu {
            private int count;
        }

        @Data
        public static class Nic {
            private NicValue value;

            @Data
            public static class NicValue {
                private Backing backing;

                @Data
                public static class Backing {
                    private String network_name;
                }
            }
        }
    }
}