package com.bnt.bank.controller;

import com.bnt.bank.dto.BankRequest;
import com.bnt.bank.dto.BankResponse;
import com.bnt.bank.service.serviceImpl.BankServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bank")
public class BankController {

@Autowired
    BankServiceImpl bankService;

@PostMapping
public ResponseEntity<BankResponse> createBank(@RequestBody BankRequest bankRequest){
    BankResponse createBank = bankService.createBank(bankRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(createBank);
}

@GetMapping
    public ResponseEntity<List<BankResponse>> getAllBank(){
    List<BankResponse> getAllBank = bankService.getAllBank();
    return ResponseEntity.status(HttpStatus.FOUND).body(getAllBank);
}

}
