package com.zcsoft.rc.app.exception;

import com.sharingif.cube.core.exception.ICubeException;
import com.sharingif.cube.core.exception.validation.BindValidationCubeException;
import com.sharingif.cube.web.exception.handler.validation.SingleBindValidationCubeExceptionHandler;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * 去掉前缀body
 *
 * @author Joly
 * @version v1.0
 * @since v1.0
 * 2017/8/14 下午3:46
 */
@Component
public class ExtendedSingleBindValidationCubeExceptionHandler extends SingleBindValidationCubeExceptionHandler {

    @Override
    public void resolverMessages(ICubeException cubeException, Locale locale) {
        super.resolverMessages(cubeException, locale);

        BindValidationCubeException bindValidationCubeException = (BindValidationCubeException)cubeException;

    }

}
