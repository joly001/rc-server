package com.zcsoft.rc.warning.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.TrainWarningListReq;
import com.zcsoft.rc.api.warning.entity.TrainWarningListRsp;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.model.entity.TrainWarning;


public interface TrainWarningService extends IBaseService<TrainWarning, String> {

    /**
     * 列车警告分页查询
     * @param req
     * @param user
     * @return
     */
    HttpPaginationRepertory<TrainWarningListRsp> list(HttpPaginationCondition<TrainWarningListReq> req, User user);
	
}
