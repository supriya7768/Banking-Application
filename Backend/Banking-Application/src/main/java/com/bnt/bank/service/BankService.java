package com.bnt.bank.service;

import com.bnt.bank.dto.BankRequest;
import com.bnt.bank.dto.BankResponse;
import com.bnt.bank.entity.Bank;

import java.util.List;

public interface BankService {

    BankResponse createBank(BankRequest bankRequest);

    List<BankResponse> getAllBank();
}
