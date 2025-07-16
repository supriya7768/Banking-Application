package com.bnt.bank.exception;

public class BankAlreadyPresentException extends RuntimeException{

    public BankAlreadyPresentException(String message){
        super(message);
    }
}
