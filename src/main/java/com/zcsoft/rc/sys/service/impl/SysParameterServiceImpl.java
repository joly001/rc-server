package com.zcsoft.rc.sys.service.impl;


import com.sharingif.cube.support.service.base.impl.BaseServiceImpl;
import com.zcsoft.rc.api.sys.entity.SysParameterAllRsp;
import com.zcsoft.rc.api.sys.entity.SysParameterRsp;
import com.zcsoft.rc.sys.dao.SysParameterDAO;
import com.zcsoft.rc.sys.model.entity.SysParameter;
import com.zcsoft.rc.sys.service.SysParameterService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class SysParameterServiceImpl extends BaseServiceImpl<SysParameter, String> implements SysParameterService {
	
	private SysParameterDAO sysParameterDAO;

	@Resource
	public void setSysParameterDAO(SysParameterDAO sysParameterDAO) {
		super.setBaseDAO(sysParameterDAO);
		this.sysParameterDAO = sysParameterDAO;
	}


	@Override
	public SysParameterAllRsp all() {
		List<SysParameter> sysParameterList = sysParameterDAO.queryAll();

		SysParameterAllRsp rsp = new SysParameterAllRsp();

		if(sysParameterList == null || sysParameterList.isEmpty()) {
			return rsp;
		}

		List<SysParameterRsp> sysParameterRspList = new ArrayList<>();
		rsp.setList(sysParameterRspList);
		sysParameterList.forEach(sysParameter -> {
			SysParameterRsp sysParameterRsp = new SysParameterRsp();
			BeanUtils.copyProperties(sysParameter, sysParameterRsp);

			sysParameterRspList.add(sysParameterRsp);
		});

		return rsp;
	}


}
