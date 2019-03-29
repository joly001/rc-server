package com.zcsoft.rc.user.service.impl;


import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.bms.api.user.entity.UserLoginReq;
import com.zcsoft.rc.bms.api.user.entity.UserLoginRsp;
import com.zcsoft.rc.user.dao.UserDAO;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, String> implements UserService {
	
	private UserDAO userDAO;


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
	public UserLoginRsp login(UserLoginReq req) {
		UserLoginRsp userLoginRsp = new UserLoginRsp();
		userLoginRsp.setUsername(req.getUsername());
		return userLoginRsp;
	}
}
