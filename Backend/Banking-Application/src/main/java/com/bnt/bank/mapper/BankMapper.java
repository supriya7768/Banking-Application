package com.bnt.bank.mapper;

import com.bnt.bank.dto.BankRequest;
import com.bnt.bank.dto.BankResponse;
import com.bnt.bank.entity.Bank;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedTargetPolicy =  ReportingPolicy.IGNORE)
public interface BankMapper {

    BankMapper INSTANCE = Mappers.getMapper(BankMapper.class);

    Bank bankRequestToBank(BankRequest bankRequest);

    List<BankResponse> bankListToBankResponseList(List<Bank> bank);

    BankResponse bankToBankResponse(Bank bank);
}
