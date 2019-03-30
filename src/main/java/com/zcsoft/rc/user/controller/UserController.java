package com.zcsoft.rc.user.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.sharingif.cube.core.handler.chain.AHMChain;
import com.sharingif.cube.core.handler.chain.BHMChain;
import com.zcsoft.rc.api.user.entity.UserLoginReq;
import com.zcsoft.rc.api.user.entity.UserLoginRsp;
import com.zcsoft.rc.api.user.entity.UserTokenLoginReq;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.validation.Valid;


@Controller
@RequestMapping(value="user")
public class UserController {
	
	private UserService userService;

	public UserService getUserService() {
		return userService;
	}
	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	/**
	 * 用户登录
	 */
	@BHMChain(ref = "loginChain")
	@RequestMapping(value="login", method= RequestMethod.POST)
	public UserLoginRsp login(@Valid UserLoginReq req, @DataContainer User user){
		return userService.login(req, user);
	}

	/**
	 * 用户token登录
	 */
	@BHMChain(ref = "tokenLoginChain")
	@RequestMapping(value="tokenLogin", method= RequestMethod.POST)
	public UserLoginRsp tokenLogin(UserTokenLoginReq req, @DataContainer User user) {
		return userService.tokenLogin(req, user);
	}

	/**
	 * 用户安全退出
	 */
	@AHMChain(ref="signOutChain")
	@RequestMapping(value="signOut", method= RequestMethod.POST)
	public void signOut(@DataContainer User user) {
		userService.signOut(user);
	}

}
