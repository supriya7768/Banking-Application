package com.bnt.bank.exception;

public class BankNotFoundException extends RuntimeException{

    public BankNotFoundException(String message){
        super(message);
    }
}
