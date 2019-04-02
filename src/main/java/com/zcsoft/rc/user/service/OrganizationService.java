package com.zcsoft.rc.user.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.user.entity.OrganizationAllRsp;
import com.zcsoft.rc.user.model.entity.Organization;
import com.zcsoft.rc.user.model.entity.User;


public interface OrganizationService extends IBaseService<Organization, String> {

    /**
     * 组织查询所有
     * @param user
     * @return
     */
    OrganizationAllRsp all(User user);


}
