package com.bnt.bank.repository;

import com.bnt.bank.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankRepository extends JpaRepository<Bank,Integer> {

    @Query("SELECT b from Bank b where b.bankName = :bankName")
    List<Bank> findByName(@Param("bankName") String bankName);
}
