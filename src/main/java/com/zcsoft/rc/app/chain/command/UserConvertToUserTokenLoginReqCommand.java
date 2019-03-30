package com.zcsoft.rc.app.chain.command;

import com.sharingif.cube.core.exception.CubeException;
import com.sharingif.cube.core.handler.chain.HandlerMethodContent;
import com.sharingif.cube.core.handler.chain.command.AbstractHandlerMethodCommand;
import com.zcsoft.rc.api.user.entity.UserLoginReq;
import com.zcsoft.rc.api.user.entity.UserTokenLoginReq;
import com.zcsoft.rc.user.model.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserConvertToUserTokenLoginReqCommand extends AbstractHandlerMethodCommand {

    @Override
    public void execute(HandlerMethodContent content) throws CubeException {
        User user = content.getObject(User.class);

        UserTokenLoginReq userTokenLoginReq = new UserTokenLoginReq();
        userTokenLoginReq.setLoginToken(user.getLoginToken());

        Object[] args = {userTokenLoginReq};

        content.setArgs(args);
    }
}
