package com.zcsoft.rc.app.components.security.authentication;

import com.sharingif.cube.components.channel.HttpChannelContext;
import com.sharingif.cube.core.exception.validation.ValidationCubeException;
import com.sharingif.cube.security.authentication.AuthenticationHander;
import com.sharingif.cube.security.authentication.password.TextEncryptorPasswordAuthentication;
import com.sharingif.cube.security.exception.validation.authentication.AuthenticationCubeException;
import com.zcsoft.rc.app.constants.ErrorConstants;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class TokenAuthenticationHandler extends TextEncryptorPasswordAuthentication implements AuthenticationHander<User, HttpChannelContext>{

	private UserService userService;

	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public void handerAuthentication(User user, HttpChannelContext httpChannelContext) throws AuthenticationCubeException {

		User tokenUser = userService.getByToken(user.getLoginToken());

		if(null == tokenUser){
			throw new ValidationCubeException(ErrorConstants.USER_LOGIN_AT_OTHER_DEVICE);
		}
		
		fillInUser(user, tokenUser);
	}
	
	/**
	 * 填充用户属性
	 * @param user
	 * @param queryUser
	 */
	protected void fillInUser(User user, User queryUser) {
		user.setId(queryUser.getId());
		user.setNick(queryUser.getNick());
		user.setMobilePrefix(queryUser.getMobilePrefix());
		user.setMobile(queryUser.getMobile());
		user.setUserType(queryUser.getUserType());
		user.setWristStrapCode(queryUser.getWristStrapCode());
		user.setStatus(queryUser.getStatus());

	}
	
	
}
