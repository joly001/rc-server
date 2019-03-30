package com.zcsoft.rc.machinery.service.impl;


import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.machinery.dao.MachineryDAO;
import com.zcsoft.rc.machinery.model.entity.Machinery;
import com.zcsoft.rc.machinery.service.MachineryService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class MachineryServiceImpl extends BaseServiceImpl<Machinery, java.lang.String> implements MachineryService {
	
	private MachineryDAO machineryDAO;

	@Resource
	public void setMachineryDAO(MachineryDAO machineryDAO) {
		super.setBaseDAO(machineryDAO);
		this.machineryDAO = machineryDAO;
	}

}
