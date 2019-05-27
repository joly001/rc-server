package com.zcsoft.rc.warning.controller;


import com.sharingif.cube.core.handler.bind.annotation.DataContainer;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.TrainWarningListReq;
import com.zcsoft.rc.api.warning.entity.TrainWarningListRsp;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.service.TrainWarningService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="trainWarning")
public class TrainWarningController {
	
	private TrainWarningService trainWarningService;

	@Resource
	public void setTrainWarningService(TrainWarningService trainWarningService) {
		this.trainWarningService = trainWarningService;
	}

	/**
	 * 列车警告分页查询
	 * @param req
	 * @return
	 */
	@RequestMapping(value="list", method= RequestMethod.POST)
	public HttpPaginationRepertory<TrainWarningListRsp> list(HttpPaginationCondition<TrainWarningListReq> req, @DataContainer User user) {
		return trainWarningService.list(req, user);
	}
}
