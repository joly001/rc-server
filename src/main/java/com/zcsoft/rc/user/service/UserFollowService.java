package com.zcsoft.rc.user.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.user.entity.UserFollowReq;
import com.zcsoft.rc.api.user.entity.UserMachineryFollowReq;
import com.zcsoft.rc.api.user.entity.UserMachineryUnFollowReq;
import com.zcsoft.rc.api.user.entity.UserUnFollowReq;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.model.entity.UserFollow;


public interface UserFollowService extends IBaseService<UserFollow, java.lang.String> {

    /**
     * 用户关注
     * @param req
     * @param user
     */
    void follow(UserFollowReq req, User user);

    /**
     * 用户取消关注
     * @param req
     * @param user
     */
    void unFollow(UserUnFollowReq req, User user);

    /**
     * 用户关注机械
     * @param req
     * @param user
     */
    void machineryFollow(UserMachineryFollowReq req, User user);

    /**
     * 用户取消关注机械
     * @param req
     * @param user
     */
    void machineryUnFollow(UserMachineryUnFollowReq req, User user);

}
