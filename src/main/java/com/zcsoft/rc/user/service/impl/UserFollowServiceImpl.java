package com.zcsoft.rc.user.service.impl;


import javax.annotation.Resource;

import com.sharingif.cube.core.util.StringUtils;
import com.zcsoft.rc.api.user.entity.UserFollowReq;
import com.zcsoft.rc.api.user.entity.UserMachineryFollowReq;
import com.zcsoft.rc.api.user.entity.UserMachineryUnFollowReq;
import com.zcsoft.rc.api.user.entity.UserUnFollowReq;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.stereotype.Service;

import com.zcsoft.rc.user.model.entity.UserFollow;
import com.zcsoft.rc.user.dao.UserFollowDAO;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.user.service.UserFollowService;

import java.util.List;

@Service
public class UserFollowServiceImpl extends BaseServiceImpl<UserFollow, java.lang.String> implements UserFollowService {
	
	private UserFollowDAO userFollowDAO;

	private UserService userService;

	@Resource
	public void setUserFollowDAO(UserFollowDAO userFollowDAO) {
		super.setBaseDAO(userFollowDAO);
		this.userFollowDAO = userFollowDAO;
	}
	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	protected void follow(String userFollowId, String userId, String followType) {
		UserFollow userFollow = new UserFollow();
		userFollow.setUserId(userId);
		userFollow.setUserFollowId(userFollowId);
		userFollow.setFollowType(followType);

		UserFollow queryUserFollow = userFollowDAO.query(userFollow);

		if(queryUserFollow != null) {
			return;
		}

		userFollowDAO.insert(userFollow);
	}

	@Override
	public void follow(UserFollowReq req, User user) {
		if(StringUtils.isTrimEmpty(req.getOrganizationId())) {
			follow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_USER);

			return;
		}

		List<User> userList = userService.getOrganizationId(req.getOrganizationId());

		if(userList == null || userList.isEmpty()) {
			return;
		}

		userList.forEach(queryUser -> {
			follow(queryUser.getId(), user.getId(), UserFollow.FOLLOW_TYPE_USER);
		});

	}

	protected void unFollow(String userFollowId, String userId, String followType) {
		UserFollow userFollow = new UserFollow();
		userFollow.setUserId(userId);
		userFollow.setUserFollowId(userFollowId);
		userFollow.setFollowType(followType);

		userFollowDAO.deleteByCondition(userFollow);
	}

	@Override
	public void unFollow(UserUnFollowReq req, User user) {
		if(StringUtils.isTrimEmpty(req.getOrganizationId())) {
			unFollow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_USER);
			return;
		}

		userFollowDAO.deleteByUserIdOrganizationId(user.getId(), req.getOrganizationId(), UserFollow.FOLLOW_TYPE_USER);
	}

	@Override
	public void machineryFollow(UserMachineryFollowReq req, User user) {
		follow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_MACHINERY);
	}

	@Override
	public void machineryUnFollow(UserMachineryUnFollowReq req, User user) {
		unFollow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_MACHINERY);
	}
}
