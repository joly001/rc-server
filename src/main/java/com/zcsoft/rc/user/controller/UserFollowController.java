package com.zcsoft.rc.user.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.zcsoft.rc.api.user.entity.UserFollowReq;
import com.zcsoft.rc.api.user.entity.UserUnFollowReq;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserFollowService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="userFollow")
public class UserFollowController {
	
	private UserFollowService userFollowService;

	@Resource
	public void setUserFollowService(UserFollowService userFollowService) {
		this.userFollowService = userFollowService;
	}

	/**
	 * 用户关注
	 */
	@RequestMapping(value="follow", method= RequestMethod.POST)
	public void follow(UserFollowReq req, @DataContainer User user) {
		userFollowService.follow(req, user);
	}

	/**
	 * 用户取消关注
	 */
	@RequestMapping(value="unFollow", method= RequestMethod.POST)
	public void unFollow(UserUnFollowReq req, @DataContainer User user) {
		userFollowService.unFollow(req, user);
	}

}
