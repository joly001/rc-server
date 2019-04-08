package com.zcsoft.rc.app.exception;

import com.sharingif.cube.core.exception.ICubeException;
import com.sharingif.cube.core.exception.validation.BindValidationCubeException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.MethodArgumentNotValidException;

/**
 * 去掉前缀body
 *
 * @author Joly
 * @version v1.0
 * @since v1.0
 * 2017/8/14 下午4:01
 */
@Component
public class ExtendedSingleMethodArgumentNotValidExceptionHandler extends ExtendedSingleBindValidationCubeExceptionHandler {

    @Override
    public boolean supports(Exception exception) {
        return exception instanceof MethodArgumentNotValidException;
    }

    @Override
    protected ICubeException convertExceptionInternal(Exception exception) {
        MethodArgumentNotValidException methodArgumentNotValidException = (MethodArgumentNotValidException)exception;
        return new BindValidationCubeException(methodArgumentNotValidException.getBindingResult());
    }
}
