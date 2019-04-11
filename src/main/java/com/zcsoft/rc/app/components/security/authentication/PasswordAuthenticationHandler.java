package com.zcsoft.rc.app.components.security.authentication;

import com.sharingif.cube.components.channel.HttpChannelContext;
import com.sharingif.cube.core.util.StringUtils;
import com.sharingif.cube.security.authentication.AuthenticationHander;
import com.sharingif.cube.security.authentication.password.TextEncryptorPasswordAuthentication;
import com.sharingif.cube.security.confidentiality.encrypt.TextEncryptor;
import com.sharingif.cube.security.exception.validation.authentication.AuthenticationCubeException;
import com.zcsoft.rc.app.constants.ErrorConstants;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class PasswordAuthenticationHandler extends TextEncryptorPasswordAuthentication implements AuthenticationHander<User, HttpChannelContext>{

	private UserService userService;

	@Resource(name="bcryptTextEncryptor")
	@Override
	public void setTextEncryptor(TextEncryptor textEncryptor) {
		super.setTextEncryptor(textEncryptor);
	}
	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public void handerAuthentication(User user, HttpChannelContext httpChannelContext) throws AuthenticationCubeException {
		
		User queryUser = userService.getByUsername(user.getUsername());
		
		if(null == queryUser || StringUtils.isEmpty(queryUser.getUsername())) {
			throw new AuthenticationCubeException(ErrorConstants.USER_INCORRECT_USERNAME_OR_PASSWORD);
		}
		
		passwordAuthentication(queryUser.getPassword(), user);

	}

}
