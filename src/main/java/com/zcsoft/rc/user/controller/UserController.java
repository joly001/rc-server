package com.zcsoft.rc.user.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.sharingif.cube.core.handler.chain.AHMChain;
import com.sharingif.cube.core.handler.chain.BHMChain;
import com.zcsoft.rc.api.user.entity.*;
import com.zcsoft.rc.collectors.api.zc.entity.ZcReq;
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
	public UserLoginRsp login(@Valid UserLoginReq req){
		return userService.login(req);
	}

	/**
	 * 用户token登录
	 */
	@BHMChain(ref = "tokenLoginChain")
	@RequestMapping(value="tokenLogin", method= RequestMethod.POST)
	public UserLoginRsp tokenLogin(UserTokenLoginReq req) {
		return userService.tokenLogin(req);
	}

	/**
	 * 用户安全退出
	 */
	@AHMChain(ref="signOutChain")
	@RequestMapping(value="signOut", method= RequestMethod.POST)
	public void signOut(@DataContainer User user) {
		userService.signOut(user);
	}

	/**
	 * 施工人员数据收集
	 * @param req
	 */
	@RequestMapping(value="collectBuilder", method= RequestMethod.POST)
	public void collectBuilder(@Valid ZcReq req) {
		userService.collectBuilder(req);
	}

	/**
	 * 司机数据收集
	 * @param req
	 */
	@RequestMapping(value="collectDriver", method= RequestMethod.POST)
	public void collectDriver(@Valid ZcReq req) {
		userService.collectDriver(req);
	}

	/**
	 * 用户关注列表
	 * @param user
	 * @return
	 */
	@RequestMapping(value="followList", method= RequestMethod.POST)
	public UserFollowListListRsp followList(@DataContainer User user) {
		return userService.followList(user);
	}

	/**
	 * 组织用户列表
	 * @param req
	 * @param user
	 * @return
	 */
	@RequestMapping(value="userOrganization", method= RequestMethod.POST)
	public UserOrganizationListRsp userOrganization(UserOrganizationReq req, @DataContainer User user) {
		return userService.userOrganization(req, user);
	}

}
