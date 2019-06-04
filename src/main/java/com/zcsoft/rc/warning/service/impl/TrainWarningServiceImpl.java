package com.zcsoft.rc.warning.service.impl;


import com.sharingif.cube.persistence.database.pagination.PaginationCondition;
import com.sharingif.cube.persistence.database.pagination.PaginationRepertory;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.TrainWarningListReq;
import com.zcsoft.rc.api.warning.entity.TrainWarningListRsp;
import com.zcsoft.rc.app.constants.Constants;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.dao.TrainWarningDAO;
import com.zcsoft.rc.warning.model.entity.TrainWarning;
import com.zcsoft.rc.warning.service.TrainWarningService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class TrainWarningServiceImpl extends BaseServiceImpl<TrainWarning, String> implements TrainWarningService, ApplicationContextAware {
	
	private TrainWarningDAO trainWarningDAO;

	private ApplicationContext applicationContext;

	@Resource
	public void setTrainWarningDAO(TrainWarningDAO trainWarningDAO) {
		super.setBaseDAO(trainWarningDAO);
		this.trainWarningDAO = trainWarningDAO;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}


	@Override
	public HttpPaginationRepertory<TrainWarningListRsp> list(HttpPaginationCondition<TrainWarningListReq> req, User user) {
		TrainWarning queryTrainWarning = new TrainWarning();
		queryTrainWarning.setUserId(user.getId());
		PaginationCondition<TrainWarning> paginationCondition = new PaginationCondition<>();
		paginationCondition.setCondition(queryTrainWarning);
		paginationCondition.setCurrentPage(req.getCurrentPage());
		paginationCondition.setPageSize(Constants.PAGE_SIZE);
		paginationCondition.setQueryCount(false);

		PaginationRepertory<TrainWarning> paginationRepertory = trainWarningDAO.queryPaginationListByUserId(paginationCondition);

		HttpPaginationRepertory<TrainWarningListRsp> httpPaginationRepertory = new HttpPaginationRepertory<>(
				paginationRepertory.getTotalCount()
				,null
				,req
		);

		if(paginationRepertory.getPageItems() == null || paginationRepertory.getPageItems().isEmpty()) {
			return httpPaginationRepertory;
		}

		List<TrainWarningListRsp> trainWarningListRspList = new ArrayList<>(paginationRepertory.getPageItems().size());
		paginationRepertory.getPageItems().forEach(trainWarning -> {
			String type = trainWarning.getType();
			String warningContent;
			if(TrainWarning.TYPE_TEMPORARY_STATION.equals(type)) {
				warningContent = applicationContext.getMessage("train.warning."+ type, new String[]{trainWarning.getRailwayLinesName()}, Locale.CHINESE);
			} else {
				warningContent = applicationContext.getMessage("train.warning."+ type, new String[]{trainWarning.getWorkSegmentName()}, Locale.CHINESE);
			}

			TrainWarningListRsp trainWarningListRsp = new TrainWarningListRsp();
			BeanUtils.copyProperties(trainWarning, trainWarningListRsp);
			trainWarningListRsp.setWarningContent(warningContent);

			trainWarningListRspList.add(trainWarningListRsp);
		});
		httpPaginationRepertory.setPageItems(trainWarningListRspList);

		return httpPaginationRepertory;
	}
}
