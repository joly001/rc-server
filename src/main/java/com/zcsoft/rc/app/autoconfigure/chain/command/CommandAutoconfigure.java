package com.zcsoft.rc.app.autoconfigure.chain.command;

import com.sharingif.cube.security.authentication.AuthenticationHander;
import com.sharingif.cube.security.handler.chain.command.authentication.SecurityAuthenticationCommand;
import com.zcsoft.rc.app.components.security.authentication.PasswordAuthenticationHandler;
import com.zcsoft.rc.app.components.security.authentication.TokenAuthenticationHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CommandAutoconfigure {

    @Bean(name="passwordSecurityAuthenticationCommand")
    public SecurityAuthenticationCommand createPasswordSecurityAuthenticationCommand(PasswordAuthenticationHandler passwordAuthenticationHandler) {
        List<AuthenticationHander> authenticationHanders = new ArrayList<>();
        authenticationHanders.add(passwordAuthenticationHandler);

        SecurityAuthenticationCommand securityAuthenticationCommand = new SecurityAuthenticationCommand();
        securityAuthenticationCommand.setAuthenticationHanders(authenticationHanders);

        return securityAuthenticationCommand;
    }

    @Bean(name="tokenSecurityAuthenticationCommand")
    public SecurityAuthenticationCommand createTokenSecurityAuthenticationCommand(TokenAuthenticationHandler tokenAuthenticationHandler) {
        List<AuthenticationHander> authenticationHanders = new ArrayList<>();
        authenticationHanders.add(tokenAuthenticationHandler);

        SecurityAuthenticationCommand securityAuthenticationCommand = new SecurityAuthenticationCommand();
        securityAuthenticationCommand.setAuthenticationHanders(authenticationHanders);

        return securityAuthenticationCommand;
    }

}
