package com.zcsoft.rc.user.service;


import com.sharingif.cube.core.handler.bind.annotation.RequestMapping;
import com.sharingif.cube.core.handler.bind.annotation.RequestMethod;
import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.user.entity.*;
import com.zcsoft.rc.collectors.api.zc.entity.ZcReq;
import com.zcsoft.rc.user.model.entity.User;

import java.util.List;


public interface UserService extends IBaseService<User, String> {

    /**
     * 根据用户名查询用户
     * @param username
     * @return
     */
    User getByUsername(String username);

    /**
     * 根据token查询用户
     * @param token
     * @return
     */
    User getByToken(String token);

    /**
     * 根据组织id查询用户
     * @param organizationId
     * @return
     */
    List<User> getOrganizationId(String organizationId);

    /**
     * 用户登录
     * @param req
     * @return
     */
    UserLoginRsp login(UserLoginReq req);

    /**
     * 用户token登录
     * @param req
     * @return
     */
    UserLoginRsp tokenLogin(UserTokenLoginReq req);

    /**
     * 用户安全退出
     * @param user
     */
    void signOut(User user);

    /**
     * 施工人员数据收集
     * @param req
     */
    @RequestMapping(value="collectBuilder", method= RequestMethod.POST)
    void collectBuilder(ZcReq req);

    /**
     * 司机数据收集
     * @param req
     */
    @RequestMapping(value="collectDriver", method= RequestMethod.POST)
    void collectDriver(ZcReq req);

    /**
     * 用户关注列表
     * @param user
     * @return
     */
    UserFollowListListRsp followList(User user);

    /**
     * 组织用户列表
     * @param req
     * @param user
     * @return
     */
    UserOrganizationListRsp userOrganization(UserOrganizationReq req, User user);

}
