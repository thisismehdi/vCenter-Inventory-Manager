package com.mehdi.vCenter.Inventory.Manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonneDto {
    public RefGroup refGroup;
    public RefResource refResource;
    public RefManager refManager;
    public GroupCompany groupCompany;
    public int weeklyContractHours;
    public String refUnit ;

    @Data
    public static class RefGroup{
        public String libelle;
    }
    @Data
    public static class GroupCompany{
        public String code;
    }
    @Data
    public static class RefResource {
        public RefPerson refPerson;
    }
    @Data
    public static class RefManager {
        public RefPerson refPerson;
    }
    @Data
    public static class RefPerson {
        public String firstName;
        public String lastName;
        public String email;

    }

}
