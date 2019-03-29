package com.zcsoft.rc.user.controller;


import com.sharingif.cube.core.handler.chain.BHMChain;
import com.zcsoft.rc.bms.api.user.entity.UserLoginReq;
import com.zcsoft.rc.bms.api.user.entity.UserLoginRsp;
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
	public UserLoginRsp login(@Valid UserLoginReq req){
		return userService.login(req);
	}

	/**
	 * 用户安全退出
	 */
	@BHMChain(ref="signOutChain")
	@RequestMapping(value="signOut", method= RequestMethod.POST)
	public void signOut() {

	}

}
