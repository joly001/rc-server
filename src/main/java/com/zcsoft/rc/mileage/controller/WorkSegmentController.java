package com.zcsoft.rc.mileage.controller;


import com.zcsoft.rc.api.mileage.entity.WorkSegmentTodayListRsp;
import com.zcsoft.rc.mileage.service.WorkSegmentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="workSegment")
public class WorkSegmentController {
	
	private WorkSegmentService workSegmentService;

	@Resource
	public void setWorkSegmentService(WorkSegmentService workSegmentService) {
		this.workSegmentService = workSegmentService;
	}

	/**
	 * 作业面列表,今天施工中
	 */
	@RequestMapping(value="todayList", method= RequestMethod.POST)
	public WorkSegmentTodayListRsp todayList() {
		return workSegmentService.todayList();
	}

	
}
