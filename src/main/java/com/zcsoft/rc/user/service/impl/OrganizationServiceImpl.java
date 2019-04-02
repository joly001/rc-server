package com.zcsoft.rc.user.service.impl;


import com.sharingif.cube.core.util.StringUtils;
import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.user.entity.OrganizationAllRsp;
import com.zcsoft.rc.app.constants.Constants;
import com.zcsoft.rc.user.dao.OrganizationDAO;
import com.zcsoft.rc.user.model.entity.Organization;
import com.zcsoft.rc.user.model.entity.User;
import com.zcsoft.rc.user.model.entity.UserFollow;
import com.zcsoft.rc.user.service.OrganizationService;
import com.zcsoft.rc.user.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class OrganizationServiceImpl extends BaseServiceImpl<Organization, String> implements OrganizationService {
	
	private OrganizationDAO organizationDAO;

	private UserService userService;

	@Resource
	public void setOrganizationDAO(OrganizationDAO organizationDAO) {
		super.setBaseDAO(organizationDAO);
		this.organizationDAO = organizationDAO;
	}
	@Resource
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	protected void sortOrganization(Map<OrganizationAllRsp,List<OrganizationAllRsp>> organizationMap, OrganizationAllRsp rootOrganizationAllRsp, List<OrganizationAllRsp> rootOrganizationAllRspList){
		Collections.sort(rootOrganizationAllRspList, new Comparator<OrganizationAllRsp>(){
			public int compare(OrganizationAllRsp a, OrganizationAllRsp b) {
				return a.getSequenceNumber()-b.getSequenceNumber();
			}
		});

		rootOrganizationAllRspList.forEach(organizationAllRsp ->{
			List<OrganizationAllRsp> childs = organizationMap.get(organizationAllRsp);
			if(null != childs){
				sortOrganization(organizationMap, organizationAllRsp, childs);
			}
			rootOrganizationAllRsp.getChildOrgList().add(organizationAllRsp);
		});
	}

	@Override
	public OrganizationAllRsp all(User user) {
		OrganizationAllRsp rootOrganizationAllRsp = new OrganizationAllRsp();
		rootOrganizationAllRsp.setId(Constants.ROOT_KEY);
		rootOrganizationAllRsp.setOrgName(Constants.ROOT_KEY);
		rootOrganizationAllRsp.setSequenceNumber(0);
		rootOrganizationAllRsp.setChildOrgList(new ArrayList<>());


		List<Organization> organizationList = organizationDAO.queryUserFollowOrganizationList(user.getId(), UserFollow.FOLLOW_TYPE_ORGANIZATION);

		if(organizationList == null || organizationList.isEmpty()) {
			return rootOrganizationAllRsp;
		}

		Map<String, OrganizationAllRsp> organizationAllRspMap = new HashMap<>();
		organizationList.forEach(organization -> {
			OrganizationAllRsp organizationAllRsp = new OrganizationAllRsp();
			BeanUtils.copyProperties(organization, organizationAllRsp);
			organizationAllRsp.setChildOrgList(new ArrayList<>());
			organizationAllRspMap.put(organization.getId(), organizationAllRsp);
		});

		Map<OrganizationAllRsp,List<OrganizationAllRsp>> organizationMap = new HashMap<>();

		organizationList.forEach(organization -> {
			OrganizationAllRsp organizationAllRsp = new OrganizationAllRsp();
			BeanUtils.copyProperties(organization, organizationAllRsp);
			organizationAllRsp.setChildOrgList(new ArrayList<>());

			OrganizationAllRsp parentOrganizationAllRsp;
			if(StringUtils.isTrimEmpty(organization.getParentId())) {
				parentOrganizationAllRsp = rootOrganizationAllRsp;
			} else {
				parentOrganizationAllRsp = organizationAllRspMap.get(organization.getParentId());
			}

			List<OrganizationAllRsp> childOrganizationAllRspList = organizationMap.get(parentOrganizationAllRsp);

			if(childOrganizationAllRspList == null) {
				childOrganizationAllRspList = new ArrayList<>();
				childOrganizationAllRspList.add(organizationAllRsp);

				organizationMap.put(parentOrganizationAllRsp, childOrganizationAllRspList);
			} else {
				childOrganizationAllRspList.add(organizationAllRsp);
			}

		});


		sortOrganization(organizationMap, rootOrganizationAllRsp, organizationMap.get(rootOrganizationAllRsp));

		return rootOrganizationAllRsp;
	}
}
