package com.zcsoft.rc.user.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.zcsoft.rc.api.user.entity.OrganizationAllRsp;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.OrganizationService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="organization")
public class OrganizationController {
	
	private OrganizationService organizationService;

	@Resource
	public void setOrganizationService(OrganizationService organizationService) {
		this.organizationService = organizationService;
	}

	/**
	 * 组织查询所有
	 */
	@RequestMapping(value="all", method= RequestMethod.POST)
	public OrganizationAllRsp all(@DataContainer User user) {
		return organizationService.all(user);
	}
	
}
