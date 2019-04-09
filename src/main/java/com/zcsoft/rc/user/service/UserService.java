package com.zcsoft.rc.user.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.user.entity.*;
import com.zcsoft.rc.collectors.api.zc.entity.ZcReq;
import com.zcsoft.rc.user.model.entity.User;
import org.springframework.web.multipart.MultipartFile;

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
     * 用户修改
     * @param req
     * @return
     */
    UserUpdateRsp update(UserUpdateReq req);

    /**
     * 用户上传图片
     * @param photoFile
     * @param user
     * @return
     */
    UserPhotoRsp userPhoto(MultipartFile photoFile, User user);

    /**
     * 用户详情
     * @param userId
     * @return
     */
    UserLoginRsp details(String userId);

    /**
     * 施工人员/司机 数据收集
     * @param req
     */
    void collect(ZcReq req);

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
