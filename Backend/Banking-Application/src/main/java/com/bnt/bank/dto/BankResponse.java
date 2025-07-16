package com.bnt.bank.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BankResponse {

    private Integer bankId;
    private String bankName;
    private LocalDate createdOn;
    private LocalDate updatedOn;
}
