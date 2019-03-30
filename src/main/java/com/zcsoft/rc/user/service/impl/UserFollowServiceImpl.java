package com.zcsoft.rc.user.service.impl;


import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zcsoft.rc.user.model.entity.UserFollow;
import com.zcsoft.rc.user.dao.UserFollowDAO;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.user.service.UserFollowService;

@Service
public class UserFollowServiceImpl extends BaseServiceImpl<UserFollow, java.lang.String> implements UserFollowService {
	
	private UserFollowDAO userFollowDAO;

	@Resource
	public void setUserFollowDAO(UserFollowDAO userFollowDAO) {
		super.setBaseDAO(userFollowDAO);
		this.userFollowDAO = userFollowDAO;
	}
	
	
}
