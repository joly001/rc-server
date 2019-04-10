package com.zcsoft.rc.warning.service.impl;


import com.sharingif.cube.persistence.database.pagination.PaginationCondition;
import com.sharingif.cube.persistence.database.pagination.PaginationRepertory;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.WorkWarningListReq;
import com.zcsoft.rc.api.warning.entity.WorkWarningListRsp;
import com.zcsoft.rc.app.constants.Constants;
import com.zcsoft.rc.machinery.dao.MachineryDAO;
import com.zcsoft.rc.machinery.model.entity.Machinery;
import com.zcsoft.rc.mileage.dao.WorkSegmentDAO;
import com.zcsoft.rc.mileage.model.entity.WorkSegment;
import com.zcsoft.rc.user.dao.OrganizationDAO;
import com.zcsoft.rc.user.dao.UserDAO;
import com.zcsoft.rc.user.model.entity.Organization;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.dao.WorkWarningDAO;
import com.zcsoft.rc.warning.model.entity.WorkWarning;
import com.zcsoft.rc.warning.service.WorkWarningService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class WorkWarningServiceImpl extends BaseServiceImpl<WorkWarning, String> implements WorkWarningService {
	
	private WorkWarningDAO workWarningDAO;

	@Resource
	public void setWorkWarningDAO(WorkWarningDAO workWarningDAO) {
		super.setBaseDAO(workWarningDAO);
		this.workWarningDAO = workWarningDAO;
	}

	@Override
	public HttpPaginationRepertory<WorkWarningListReq> list(HttpPaginationCondition<WorkWarningListRsp> req, User user) {
		WorkWarning queryWorkWarning = new WorkWarning();
		queryWorkWarning.setUserId(user.getId());
		PaginationCondition<WorkWarning> paginationCondition = new PaginationCondition<>();
		paginationCondition.setCondition(queryWorkWarning);
		paginationCondition.setCurrentPage(req.getCurrentPage());
		paginationCondition.setPageSize(Constants.PAGE_SIZE);

		PaginationRepertory<WorkWarning> paginationRepertory = workWarningDAO.queryPagination(paginationCondition);

		return null;
	}
}
