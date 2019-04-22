package com.zcsoft.rc.user.service.impl;


import javax.annotation.Resource;

import com.sharingif.cube.core.util.StringUtils;
import com.zcsoft.rc.api.machinery.entity.MachineryListRsp;
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
import org.springframework.transaction.annotation.Transactional;

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

	@Transactional
	protected void follow(String userId, String organizationId, List<User> userList) {
		UserFollow userFollow = new UserFollow();
		userFollow.setUserId(userId);
		userFollow.setUserFollowId(organizationId);
		userFollow.setFollowType(UserFollow.FOLLOW_TYPE_ORGANIZATION);
		userFollowDAO.insert(userFollow);

		userList.forEach(queryUser -> {
			follow(queryUser.getId(), userId, UserFollow.FOLLOW_TYPE_USER);
		});
	}

	@Override
	public void follow(UserFollowReq req, User user) {
		if(StringUtils.isTrimEmpty(req.getOrganizationId())) {
			follow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_USER);

			return;
		}

		List<User> userList = userService.getOrganizationId(req.getOrganizationId());

		if(userList == null || userList.isEmpty()) {
			UserFollow userFollow = new UserFollow();
			userFollow.setUserId(user.getId());
			userFollow.setUserFollowId(req.getOrganizationId());
			userFollow.setFollowType(UserFollow.FOLLOW_TYPE_ORGANIZATION);
			userFollowDAO.insert(userFollow);
			return;
		}

		follow(user.getId(), req.getOrganizationId(), userList);
	}

	protected void unFollow(String userFollowId, String userId, String followType) {
		UserFollow userFollow = new UserFollow();
		userFollow.setUserId(userId);
		userFollow.setUserFollowId(userFollowId);
		userFollow.setFollowType(followType);

		userFollowDAO.deleteByCondition(userFollow);
	}

	@Transactional
	protected void unFollow(String userId, String organizationId) {
		UserFollow deleteUserFollow = new UserFollow();
		deleteUserFollow.setUserId(userId);
		deleteUserFollow.setUserFollowId(organizationId);
		deleteUserFollow.setFollowType(UserFollow.FOLLOW_TYPE_ORGANIZATION);
		userFollowDAO.deleteByCondition(deleteUserFollow);

		userFollowDAO.deleteByUserIdOrganizationId(userId, organizationId, UserFollow.FOLLOW_TYPE_USER);
	}

	@Override
	public void unFollow(UserUnFollowReq req, User user) {
		if(StringUtils.isTrimEmpty(req.getOrganizationId())) {
			unFollow(req.getUserFollowId(), user.getId(), UserFollow.FOLLOW_TYPE_USER);

			User queryUser = userService.getById(req.getUserFollowId());
			String organizationId = queryUser.getOrganizationId();
			List<UserFollow> userFollowList = userFollowDAO.queryListByUserIdOrganizationId(user.getId(), organizationId);
			if(userFollowList == null || userFollowList.isEmpty()) {
				unFollow(user.getId(), organizationId);
			}
			return;
		}

		unFollow(user.getId(), req.getOrganizationId());
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
