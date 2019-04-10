package com.zcsoft.rc.warning.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.WorkWarningListRsp;
import com.zcsoft.rc.api.warning.entity.WorkWarningListReq;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.service.WorkWarningService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.validation.Valid;


@Controller
@RequestMapping(value="workWarning")
public class WorkWarningController {
	
	private WorkWarningService workWarningService;

	@Resource
	public void setWorkWarningService(WorkWarningService workWarningService) {
		this.workWarningService = workWarningService;
	}

	/**
	 * 警告分页查询
	 */
	@RequestMapping(value="list", method= RequestMethod.POST)
	public HttpPaginationRepertory<WorkWarningListRsp> list(@Valid HttpPaginationCondition<WorkWarningListReq> req, @DataContainer User user) {
		return workWarningService.list(req, user);
	}
	
}
