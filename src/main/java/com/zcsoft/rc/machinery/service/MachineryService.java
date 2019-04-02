package com.zcsoft.rc.machinery.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.machinery.entity.MachineryListRsp;
import com.zcsoft.rc.api.machinery.entity.MachineryUserFollowListRsp;
import com.zcsoft.rc.machinery.model.entity.Machinery;
import com.zcsoft.rc.user.model.entity.User;


public interface MachineryService extends IBaseService<Machinery, java.lang.String> {

    /**
     * 查询机械列表，包含用户关注标志
     * @param user
     * @return
     */
    MachineryListRsp followList(User user);

    /**
     * 用户关注机械列表
     * @param user
     * @return
     */
    MachineryUserFollowListRsp userfollowMachineryList(User user);

}
