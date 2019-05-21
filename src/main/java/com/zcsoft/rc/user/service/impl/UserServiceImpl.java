package com.zcsoft.rc.user.service.impl;


import com.sharingif.cube.core.exception.UnknownCubeException;
import com.sharingif.cube.core.exception.validation.ValidationCubeException;
import com.sharingif.cube.core.util.DateUtils;
import com.sharingif.cube.core.util.StringUtils;
import com.sharingif.cube.core.util.UUIDUtils;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.user.entity.*;
import com.zcsoft.rc.app.constants.ErrorConstants;
import com.zcsoft.rc.app.constants.PatternConstants;
import com.zcsoft.rc.collectors.api.zc.entity.ZcReq;
import com.zcsoft.rc.collectors.api.zc.service.ZcApiService;
import com.zcsoft.rc.user.dao.UserDAO;
import com.zcsoft.rc.user.model.entity.Organization;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.model.entity.UserFollow;
import com.zcsoft.rc.user.service.OrganizationService;
import com.zcsoft.rc.user.service.UserService;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, String> implements UserService, ApplicationContextAware {
	
	private UserDAO userDAO;

	private int userTokenExpireDaily;
	private String userPhotoFilePath;

	private ZcApiService zcApiService;
	private OrganizationService organizationService;
	private ApplicationContext applicationContext;

	@Value("${user.token.expire.daily}")
	public void setUserTokenExpireDaily(int userTokenExpireDaily) {
		this.userTokenExpireDaily = userTokenExpireDaily;
	}
	@Value("${user.photo.file.path}")
	public void setUserPhotoFilePath(String userPhotoFilePath) {
		this.userPhotoFilePath = userPhotoFilePath;
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
	@Resource
	public void setOrganizationService(OrganizationService organizationService) {
		this.organizationService = organizationService;
	}
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
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

	protected void updateUser(User user, String messagingToken, String operatingSystem) {
		String loginToken = UUIDUtils.generateUUID();
		Date loginTokenExpiratTime = DateUtils.addDateDay(new Date(), userTokenExpireDaily);

		user.setLoginToken(loginToken);
		user.setLoginTokenExpiratTime(loginTokenExpiratTime);

		User updateUser = new User();
		updateUser.setId(user.getId());
		updateUser.setLoginToken(loginToken);
		updateUser.setLoginTokenExpiratTime(loginTokenExpiratTime);
		updateUser.setMessagingToken(messagingToken);
		updateUser.setOperatingSystem(operatingSystem);

		userDAO.updateById(updateUser);
	}

	private String convertBuilderUserType(String builderUserType) {
		return applicationContext.getMessage(builderUserType, null, Locale.CHINESE);
	}

	@Override
	public UserLoginRsp login(UserLoginReq req) {
		User user = getByUsername(req.getUsername());

		updateUser(user, req.getMessagingToken(), req.getOperatingSystem());

		UserLoginRsp rsp = new UserLoginRsp();
		BeanUtils.copyProperties(user, rsp);

		Organization organization = organizationService.getById(user.getOrganizationId());
		rsp.setOrgName(organization.getOrgName());
		rsp.setBuilderUserType(user.getBuilderUserType());

		return rsp;
	}

	@Override
	public UserLoginRsp tokenLogin(UserTokenLoginReq req) {
		User user = getByToken(req.getLoginToken());

		updateUser(user, null, null);

		UserLoginRsp rsp = new UserLoginRsp();
		BeanUtils.copyProperties(user, rsp);

		Organization organization = organizationService.getById(user.getOrganizationId());
		rsp.setOrgName(organization.getOrgName());
		rsp.setBuilderUserType(user.getBuilderUserType());

		return rsp;
	}

	@Override
	public void signOut(User user) {
		User updateUser = new User();
		updateUser.setId(user.getId());
		user.setLoginTokenExpiratTime(new Date());

		userDAO.updateById(updateUser);
	}

	protected void verifyIdExistence(User user) {
		if(user == null) {
			throw new ValidationCubeException(ErrorConstants.USER_NOT_EXIST);
		}
	}

	protected void verifyMobileExistence(String id, String mobile) {
		User user = new User();
		user.setMobile(mobile);

		user = userDAO.query(user);

		if(user == null) {
			return;
		}

		if(user.getId().equals(id)) {
			return;
		}

		throw new ValidationCubeException(ErrorConstants.USER_MOBILE_ALREADY_EXIST);
	}

	protected void verifyWristStrapCodeExistence(String id, String wristStrapCode) {
		User user = new User();
		user.setWristStrapCode(wristStrapCode);

		user = userDAO.query(user);

		if(user == null) {
			return;
		}

		if(user.getId().equals(id)) {
			return;
		}

		throw new ValidationCubeException(ErrorConstants.USER_WRISTSTRAPCODE_ALREADY_EXIST);
	}

	@Override
	public UserUpdateRsp update(UserUpdateReq req) {
		User queryUser = userDAO.queryById(req.getId());
		verifyIdExistence(queryUser);

		if(!StringUtils.isTrimEmpty(req.getMobile())) {
			if(!Pattern.matches(PatternConstants.REGEX_MOBILE, req.getMobile())){
				throw new ValidationCubeException(ErrorConstants.USER_MOBILE_FORMAT_ERROR);
			}
			verifyMobileExistence(req.getId(), req.getMobile());
		}

		if(!StringUtils.isTrimEmpty(req.getWristStrapCode())) {
			verifyWristStrapCodeExistence(req.getId(), req.getWristStrapCode());
		}

		User updateUser = new User();
		BeanUtils.copyProperties(req, updateUser);
		if(!StringUtils.isTrimEmpty(req.getMobile())) {
			updateUser.setUsername(req.getMobile());
		}

		userDAO.updateById(updateUser);

		queryUser = userDAO.queryById(req.getId());

		UserUpdateRsp rsp = new UserUpdateRsp();
		BeanUtils.copyProperties(queryUser, rsp);

		Organization organization = organizationService.getById(queryUser.getOrganizationId());
		rsp.setOrgName(organization.getOrgName());
		rsp.setBuilderUserType(convertBuilderUserType(queryUser.getBuilderUserType()));

		return rsp;
	}

	@Override
	public UserPhotoRsp userPhoto(MultipartFile photoFile, User user) {
		String userId = user.getId();

		StringBuffer pathBuffer =  new StringBuffer(userPhotoFilePath);
		String pid = UUIDUtils.generateUUID();
		String aftFix = photoFile.getOriginalFilename().substring(photoFile.getOriginalFilename().lastIndexOf("."));
		String savePhotoPath = new StringBuilder().append(userId).append("/").append(pid).append(aftFix).toString();
		String filePath = pathBuffer.append("/").append(savePhotoPath).toString();

		try {
			FileUtils.copyInputStreamToFile(photoFile.getInputStream(), new File(filePath));
		} catch (IOException e) {
			throw new UnknownCubeException(e);
		}

		UserPhotoRsp rsp = new UserPhotoRsp();
		rsp.setUserPhotoPath(savePhotoPath);

		return rsp;
	}

	@Override
	public UserLoginRsp details(String userId) {
		User user = userDAO.queryById(userId);

		UserLoginRsp rsp = new UserLoginRsp();
		BeanUtils.copyProperties(user, rsp);

		Organization organization = organizationService.getById(user.getOrganizationId());
		rsp.setOrgName(organization.getOrgName());
		rsp.setBuilderUserType(convertBuilderUserType(user.getBuilderUserType()));

		return rsp;
	}

	@Override
	public void collect(ZcReq req) {
		zcApiService.collect(req);
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

			userFollowListRsp.setBuilderUserType(convertBuilderUserType(queryUser.getBuilderUserType()));

			userFollowListRspList.add(userFollowListRsp);
		});
		rsp.setList(userFollowListRspList);

		return rsp;
	}

	@Override
	public UserOrganizationListRsp userOrganization(UserOrganizationReq req, User user) {

		List<User> userList;
		if(StringUtils.isTrimEmpty(req.getNick())) {
			userList = userDAO.queryUserFollowListByOrganizationId(user.getId(), req.getOrganizationId(), UserFollow.FOLLOW_TYPE_USER, null);
		} else {
			userList = userDAO.queryUserFollowListByOrganizationId(user.getId(), null, UserFollow.FOLLOW_TYPE_USER, req.getNick());
		}

		UserOrganizationListRsp rsp = new UserOrganizationListRsp();

		if(userList == null || userList.isEmpty()) {
			return rsp;
		}

		List<UserOrganizationRsp> userOrganizationRspList = new ArrayList<>(userList.size());
		userList.forEach(queryUser -> {
			UserOrganizationRsp userOrganizationRsp = new UserOrganizationRsp();
			BeanUtils.copyProperties(queryUser, userOrganizationRsp);

			userOrganizationRsp.setBuilderUserType(convertBuilderUserType(queryUser.getBuilderUserType()));

			userOrganizationRspList.add(userOrganizationRsp);
		});

		rsp.setList(userOrganizationRspList);

		return rsp;
	}
}
