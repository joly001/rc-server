package com.zcsoft.rc.warning.service.impl;


import com.sharingif.cube.persistence.database.pagination.PaginationCondition;
import com.sharingif.cube.persistence.database.pagination.PaginationRepertory;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.WorkWarningListRsp;
import com.zcsoft.rc.api.warning.entity.WorkWarningListReq;
import com.zcsoft.rc.app.constants.Constants;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.dao.WorkWarningDAO;
import com.zcsoft.rc.warning.model.entity.WorkWarning;
import com.zcsoft.rc.warning.service.WorkWarningService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkWarningServiceImpl extends BaseServiceImpl<WorkWarning, String> implements WorkWarningService {
	
	private WorkWarningDAO workWarningDAO;

	@Resource
	public void setWorkWarningDAO(WorkWarningDAO workWarningDAO) {
		super.setBaseDAO(workWarningDAO);
		this.workWarningDAO = workWarningDAO;
	}

	@Override
	public HttpPaginationRepertory<WorkWarningListRsp> list(HttpPaginationCondition<WorkWarningListReq> req, User user) {
		WorkWarning queryWorkWarning = new WorkWarning();
		queryWorkWarning.setUserId(user.getId());
		PaginationCondition<WorkWarning> paginationCondition = new PaginationCondition<>();
		paginationCondition.setCondition(queryWorkWarning);
		paginationCondition.setCurrentPage(req.getCurrentPage());
		paginationCondition.setPageSize(Constants.PAGE_SIZE);

		PaginationRepertory<WorkWarning> paginationRepertory = workWarningDAO.queryPagination(paginationCondition);

		HttpPaginationRepertory<WorkWarningListRsp> httpPaginationRepertory = new HttpPaginationRepertory<>(
				paginationRepertory.getTotalCount()
				,null
				,req
		);

		if(paginationRepertory.getPageItems() == null || paginationRepertory.getPageItems().isEmpty()) {
			return httpPaginationRepertory;
		}

		List<WorkWarningListRsp> workSegmentListRspList = new ArrayList<>(paginationRepertory.getPageItems().size());
		paginationRepertory.getPageItems().forEach(workWarning -> {
			WorkWarningListRsp workWarningListRsp = new WorkWarningListRsp();
			BeanUtils.copyProperties(workWarning, workWarningListRsp);

			workSegmentListRspList.add(workWarningListRsp);
		});
		httpPaginationRepertory.setPageItems(workSegmentListRspList);

		return httpPaginationRepertory;

	}
}
