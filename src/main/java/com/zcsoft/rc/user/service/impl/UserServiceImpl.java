package com.zcsoft.rc.user.service.impl;


import com.sharingif.cube.core.util.DateUtils;
import com.sharingif.cube.core.util.UUIDUtils;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.user.entity.*;
import com.zcsoft.rc.collectors.api.zc.entity.ZcReq;
import com.zcsoft.rc.collectors.api.zc.service.ZcApiService;
import com.zcsoft.rc.user.dao.UserDAO;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, String> implements UserService {
	
	private UserDAO userDAO;

	private int userTokenExpireDaily;

	private ZcApiService zcApiService;

	@Value("${user.token.expire.daily}")
	public void setUserTokenExpireDaily(int userTokenExpireDaily) {
		this.userTokenExpireDaily = userTokenExpireDaily;
	}

	@Resource
	public void setUserDAO(UserDAO userDAO) {
		super.setBaseDAO(userDAO);
		this.userDAO = userDAO;
	}
	@Resource
	public void setZcApiService(ZcApiService zcApiService) {
		this.zcApiService = zcApiService;
	}

	@Override
	public User getByUsername(String username) {
		User user = new User();
		user.setUsername(username);

		return userDAO.query(user);
	}

	@Override
	public User getByToken(String token) {
		User tokenUser = new User();
		tokenUser.setLoginToken(token);

		return userDAO.query(tokenUser);
	}

	@Override
	public List<User> getOrganizationId(String organizationId) {
		User queryUser = new User();
		queryUser.setOrganizationId(organizationId);

		return userDAO.queryList(queryUser);
	}

	protected void updateUserToken(User user) {
		String loginToken = UUIDUtils.generateUUID();
		Date loginTokenExpiratTime = DateUtils.addDateDay(new Date(), userTokenExpireDaily);

		user.setLoginToken(loginToken);
		user.setLoginTokenExpiratTime(loginTokenExpiratTime);

		User updateUser = new User();
		updateUser.setId(user.getId());
		updateUser.setLoginToken(loginToken);
		updateUser.setLoginTokenExpiratTime(loginTokenExpiratTime);

		userDAO.updateById(updateUser);
	}

	protected UserLoginRsp userConvertToUserLoginRsp(User user) {
		UserLoginRsp userLoginRsp = new UserLoginRsp();
		userLoginRsp.setNick(user.getNick());
		userLoginRsp.setWristStrapCode(user.getWristStrapCode());
		userLoginRsp.setLoginToken(user.getLoginToken());

		return userLoginRsp;
	}

	@Override
	public UserLoginRsp login(UserLoginReq req) {
		User user = getByUsername(req.getUsername());

		updateUserToken(user);

		return userConvertToUserLoginRsp(user);
	}

	@Override
	public UserLoginRsp tokenLogin(UserTokenLoginReq req) {
		User user = getByToken(req.getLoginToken());

		updateUserToken(user);

		return userConvertToUserLoginRsp(user);

	}

	@Override
	public void signOut(User user) {
		User updateUser = new User();
		updateUser.setId(user.getId());
		user.setLoginTokenExpiratTime(new Date());

		userDAO.updateById(updateUser);
	}

	@Override
	public void collectBuilder(ZcReq req) {
		zcApiService.collectBuilder(req);
	}

	@Override
	public void collectDriver(ZcReq req) {
		zcApiService.collectDriver(req);
	}

	@Override
	public UserFollowListListRsp followList(User user) {
		List<User> userList = userDAO.queryUserFollowListByUserId(user.getId());

		UserFollowListListRsp rsp = new UserFollowListListRsp();
		if(userList == null || userList.isEmpty()) {
			return rsp;
		}

		List<UserFollowListRsp> userFollowListRspList = new ArrayList<>(userList.size());
		userList.forEach(queryUser -> {
			UserFollowListRsp userFollowListRsp = new UserFollowListRsp();
			BeanUtils.copyProperties(queryUser, userFollowListRsp);

			userFollowListRspList.add(userFollowListRsp);
		});
		rsp.setList(userFollowListRspList);

		return rsp;
	}

	@Override
	public UserOrganizationListRsp userOrganization(UserOrganizationReq req, User user) {
		List<User> userList = userDAO.queryUserFollowListByOrganizationId(user.getId(), req.getOrganizationId());

		UserOrganizationListRsp rsp = new UserOrganizationListRsp();

		if(userList == null || userList.isEmpty()) {
			return rsp;
		}

		List<UserOrganizationRsp> userOrganizationRspList = new ArrayList<>(userList.size());
		userList.forEach(queryUser -> {
			UserOrganizationRsp userOrganizationRsp = new UserOrganizationRsp();
			BeanUtils.copyProperties(queryUser, userOrganizationRsp);

			userOrganizationRspList.add(userOrganizationRsp);
		});

		rsp.setList(userOrganizationRspList);

		return rsp;
	}
}
