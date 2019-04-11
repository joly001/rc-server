package com.zcsoft.rc.sys.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.sys.entity.SysParameterAllRsp;
import com.zcsoft.rc.sys.model.entity.SysParameter;


public interface SysParameterService extends IBaseService<SysParameter, String> {

    /**
     * 参数查询所有
     * @return
     */
    SysParameterAllRsp all();
	
}
