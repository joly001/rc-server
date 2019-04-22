package com.zcsoft.rc.machinery.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.zcsoft.rc.api.machinery.entity.MachineryListReq;
import com.zcsoft.rc.api.machinery.entity.MachineryListRsp;
import com.zcsoft.rc.api.machinery.entity.MachineryUserFollowListRsp;
import com.zcsoft.rc.machinery.service.MachineryService;
import com.zcsoft.rc.user.model.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="machinery")
public class MachineryController {
	
	private MachineryService machineryService;

	@Resource
	public void setMachineryService(MachineryService machineryService) {
		this.machineryService = machineryService;
	}

	/**
	 * 查询机械列表，包含用户关注标志
	 */
	@RequestMapping(value="followList", method= RequestMethod.POST)
	public MachineryListRsp followList(MachineryListReq req, @DataContainer User user) {
		return machineryService.followList(req, user);
	}

	/**
	 * 用户关注机械列表
	 */
	@RequestMapping(value="userfollowMachineryList", method= RequestMethod.POST)
	public MachineryUserFollowListRsp userfollowMachineryList(@DataContainer User user) {
		return machineryService.userfollowMachineryList(user);
	}

}
