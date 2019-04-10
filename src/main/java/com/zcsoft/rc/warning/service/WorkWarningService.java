package com.zcsoft.rc.warning.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.http.HttpPaginationCondition;
import com.zcsoft.rc.api.http.HttpPaginationRepertory;
import com.zcsoft.rc.api.warning.entity.WorkWarningListReq;
import com.zcsoft.rc.api.warning.entity.WorkWarningListRsp;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.warning.model.entity.WorkWarning;


public interface WorkWarningService extends IBaseService<WorkWarning, String> {

    /**
     * 警告分页查询
     * @param req
     * @param user
     * @return
     */
    HttpPaginationRepertory<WorkWarningListReq> list(HttpPaginationCondition<WorkWarningListRsp> req, User user);

}
