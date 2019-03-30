package com.zcsoft.rc.user.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.user.entity.UserLoginReq;
import com.zcsoft.rc.api.user.entity.UserLoginRsp;
import com.zcsoft.rc.api.user.entity.UserTokenLoginReq;
import com.zcsoft.rc.user.model.entity.User;


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
     * 用户登录
     * @param req
     * @param user
     * @return
     */
    UserLoginRsp login(UserLoginReq req, User user);

    /**
     * 用户token登录
     * @param req
     * @param user
     * @return
     */
    UserLoginRsp tokenLogin(UserTokenLoginReq req, User user);

    /**
     * 用户安全退出
     * @param user
     */
    void signOut(User user);


}
