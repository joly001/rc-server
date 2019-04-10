package com.zcsoft.rc.mileage.service.impl;


import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.mileage.entity.WorkSegmentTodayListRsp;
import com.zcsoft.rc.api.mileage.entity.WorkSegmentTodayRsp;
import com.zcsoft.rc.mileage.dao.WorkSegmentDAO;
import com.zcsoft.rc.mileage.model.entity.WorkSegment;
import com.zcsoft.rc.mileage.service.WorkSegmentService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class WorkSegmentServiceImpl extends BaseServiceImpl<WorkSegment, String> implements WorkSegmentService {
	
	private WorkSegmentDAO workSegmentDAO;

	@Resource
	public void setWorkSegmentDAO(WorkSegmentDAO workSegmentDAO) {
		super.setBaseDAO(workSegmentDAO);
		this.workSegmentDAO = workSegmentDAO;
	}


	@Override
	public WorkSegmentTodayListRsp todayList() {
		LocalDate nowDate = LocalDate.now();
		LocalDateTime beginLocalDateTime = LocalDateTime.of(nowDate, LocalTime.MIN);
		LocalDateTime endLocalDateTime = LocalDateTime.of(nowDate,LocalTime.MAX);

		ZoneId zone = ZoneId.systemDefault();
		Instant beginInstant = beginLocalDateTime.atZone(zone).toInstant();
		Instant endInstant = endLocalDateTime.atZone(zone).toInstant();

		Date beginDateTime = Date.from(beginInstant);
		Date endDateTime = Date.from(endInstant);


		List<WorkSegment> workSegmentList = workSegmentDAO.queryListByWorkDate(beginDateTime, endDateTime);

		WorkSegmentTodayListRsp rsp = new WorkSegmentTodayListRsp();
		if(workSegmentList == null || workSegmentList.isEmpty()) {
			return rsp;
		}

		List<WorkSegmentTodayRsp> workSegmentTodayRspList = new ArrayList<>();
		rsp.setList(workSegmentTodayRspList);
		workSegmentList.forEach(workSegment -> {
			WorkSegmentTodayRsp workSegmentTodayRsp = new WorkSegmentTodayRsp();
			BeanUtils.copyProperties(workSegment, workSegmentTodayRsp);

			workSegmentTodayRspList.add(workSegmentTodayRsp);
		});

		return rsp;
	}
}
