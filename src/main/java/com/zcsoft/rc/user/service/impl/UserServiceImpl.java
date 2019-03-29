package com.zcsoft.rc.user.service.impl;


import com.sharingif.cube.core.util.DateUtils;
import com.sharingif.cube.core.util.UUIDUtils;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.user.entity.UserLoginReq;
import com.zcsoft.rc.api.user.entity.UserLoginRsp;
import com.zcsoft.rc.user.dao.UserDAO;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, String> implements UserService {
	
	private UserDAO userDAO;

	private int userTokenExpireDaily;

	@Value("${user.token.expire.daily}")
	public void setUserTokenExpireDaily(int userTokenExpireDaily) {
		this.userTokenExpireDaily = userTokenExpireDaily;
	}

	@Resource
	public void setUserDAO(UserDAO userDAO) {
		super.setBaseDAO(userDAO);
		this.userDAO = userDAO;
	}

	@Override
	public User getByUsername(String username) {
		User user = new User();
		user.setUsername(username);

		return userDAO.query(user);
	}

	@Override
	public UserLoginRsp login(UserLoginReq req, User user) {
		// 生成token
		String loginToken = UUIDUtils.generateUUID();
		Date loginTokenExpiratTime = DateUtils.addDateDay(new Date(), userTokenExpireDaily);

		user.setLoginToken(loginToken);
		user.setLoginTokenExpiratTime(loginTokenExpiratTime);

		User updateUser = new User();
		updateUser.setId(user.getId());
		updateUser.setLoginToken(loginToken);
		updateUser.setLoginTokenExpiratTime(loginTokenExpiratTime);

		userDAO.updateById(updateUser);

		UserLoginRsp userLoginRsp = new UserLoginRsp();
		userLoginRsp.setUsername(req.getUsername());
		userLoginRsp.setWristStrapCode(user.getWristStrapCode());
		userLoginRsp.setLoginToken(loginToken);

		return userLoginRsp;
	}
}
