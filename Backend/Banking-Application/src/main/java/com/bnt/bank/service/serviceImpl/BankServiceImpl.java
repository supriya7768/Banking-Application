package com.bnt.bank.service.serviceImpl;

import com.bnt.bank.dto.BankRequest;
import com.bnt.bank.dto.BankResponse;
import com.bnt.bank.entity.Bank;
import com.bnt.bank.exception.BankAlreadyPresentException;
import com.bnt.bank.exception.BankNotFoundException;
import com.bnt.bank.mapper.BankMapper;
import com.bnt.bank.repository.BankRepository;
import com.bnt.bank.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BankServiceImpl implements BankService {

    @Autowired
    BankRepository bankRepository;

    public BankServiceImpl(BankRepository bankRepository){
        this.bankRepository = bankRepository;
    }

    @Override
    public BankResponse createBank(BankRequest bankRequest) {
        String bankName = bankRequest.getBankName();
        List<Bank> existingBank = bankRepository.findByName(bankName);
        if (!existingBank.isEmpty()){
            throw new BankAlreadyPresentException("Bank with name " + bankName + " is already present");
        }
        Bank bank = BankMapper.INSTANCE.bankRequestToBank(bankRequest);
        bank.setCreatedOn(LocalDate.now());
        bank.setUpdatedOn(LocalDate.now());
        Bank createdBank = bankRepository.save(bank);
        return BankMapper.INSTANCE.bankToBankResponse(createdBank);
    }

    @Override
    public List<BankResponse> getAllBank() {
        List<Bank> bankList = bankRepository.findAll();
        if (bankList.isEmpty()){
            throw new BankNotFoundException("Banks not found");
        }
        return BankMapper.INSTANCE.bankListToBankResponseList(bankList);
    }
}
