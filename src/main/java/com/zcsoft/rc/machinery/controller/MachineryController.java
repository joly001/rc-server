package com.zcsoft.rc.machinery.controller;


import com.zcsoft.rc.machinery.service.MachineryService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;


@Controller
@RequestMapping(value="machinery")
public class MachineryController {
	
	private MachineryService machineryService;

	@Resource
	public void setMachineryService(MachineryService machineryService) {
		this.machineryService = machineryService;
	}
	
}
