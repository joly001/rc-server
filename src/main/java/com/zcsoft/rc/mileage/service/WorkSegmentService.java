package com.zcsoft.rc.mileage.service;


import com.sharingif.cube.support.service.base.IBaseService;
import com.zcsoft.rc.api.mileage.entity.WorkSegmentTodayListRsp;
import com.zcsoft.rc.mileage.model.entity.WorkSegment;


public interface WorkSegmentService extends IBaseService<WorkSegment, String> {

    /**
     * 作业面列表,今天施工中
     * @return
     */
    WorkSegmentTodayListRsp todayList();

}
