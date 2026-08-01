package com.ims.premiums;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.context.config.annotation.RefreshScope;

@SpringBootApplication
@RefreshScope
public class PremiumsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PremiumsApplication.class, args);
	}

}
