package com.zcsoft.rc.app.constants;

public interface ErrorConstants {

    /**
     * 用户名或密码错误
     */
    String USER_INCORRECT_USERNAME_OR_PASSWORD = "003000";
    /**
     * 该手机号码已存在
     */
    String USER_MOBILE_ALREADY_EXIST = "003001";
    /**
     * 该手环编号已存在
     */
    String USER_WRISTSTRAPCODE_ALREADY_EXIST = "003002";
    /**
     * 用户不存在
     */
    String USER_NOT_EXIST = "003004";
    /**
     * 账号已登录另一台设备，请重新登录
     */
    String USER_LOGIN_AT_OTHER_DEVICE = "003005";
}
