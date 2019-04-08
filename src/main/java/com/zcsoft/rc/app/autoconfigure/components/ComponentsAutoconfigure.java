package com.zcsoft.rc.app.autoconfigure.components;

import com.sharingif.cube.security.web.exception.handler.validation.access.AccessDecisionCubeExceptionHandler;
import com.sharingif.cube.web.exception.handler.WebCubeExceptionHandler;
import com.sharingif.cube.web.exception.handler.validation.TokenValidationCubeExceptionHandler;
import com.sharingif.cube.web.exception.handler.validation.ValidationCubeExceptionHandler;
import com.sharingif.cube.web.springmvc.exception.NoHandlerFoundExceptionHandler;
import com.zcsoft.rc.app.exception.ExtendedSingleBindValidationCubeExceptionHandler;
import com.zcsoft.rc.app.exception.ExtendedSingleMethodArgumentNotValidExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.support.ManagedMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
public class ComponentsAutoconfigure {

    @Bean(name="fileResourceHttpRequestHandler")
    public ResourceHttpRequestHandler createFileResourceHttpRequestHandler(@Value("${user.photo.file.path}") String userPhotoFilePath) {

        List<Resource> locations = new ArrayList<>();
        locations.add(new PathResource(userPhotoFilePath));

        ResourceHttpRequestHandler resourceHttpRequestHandler = new ResourceHttpRequestHandler();
        resourceHttpRequestHandler.setLocations(locations);

        return resourceHttpRequestHandler;
    }

    @Bean(name="simpleUrlHandlerMapping")
    public SimpleUrlHandlerMapping createSimpleUrlHandlerMapping(ResourceHttpRequestHandler resourceHttpRequestHandler, ResourceHttpRequestHandler fileResourceHttpRequestHandler) {

        Map<String, ResourceHttpRequestHandler> urlMap = new ManagedMap<>();
        urlMap.put("/static/**", resourceHttpRequestHandler);
        urlMap.put("/photo/**", fileResourceHttpRequestHandler);
        urlMap.put("**/favicon.ico", resourceHttpRequestHandler);

        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(urlMap);

        return simpleUrlHandlerMapping;
    }

    @Bean(name = "springMVCCubeExceptionHandlers")
    public List<WebCubeExceptionHandler> createSpringMVCCubeExceptionHandlers(
            AccessDecisionCubeExceptionHandler accessDecisionCubeExceptionHandler
            , TokenValidationCubeExceptionHandler tokenValidationCubeExceptionHandler
            , ExtendedSingleMethodArgumentNotValidExceptionHandler extendedSingleMethodArgumentNotValidExceptionHandler
            , ExtendedSingleBindValidationCubeExceptionHandler extendedSingleBindValidationCubeExceptionHandler
            , NoHandlerFoundExceptionHandler noHandlerFoundExceptionHandler
            , ValidationCubeExceptionHandler validationCubeExceptionHandler
            , WebCubeExceptionHandler webCubeExceptionHandler) {

        List<WebCubeExceptionHandler> springMVCCubeExceptionHandlers = new ArrayList<WebCubeExceptionHandler>();
        springMVCCubeExceptionHandlers.add(accessDecisionCubeExceptionHandler);
        springMVCCubeExceptionHandlers.add(tokenValidationCubeExceptionHandler);
        springMVCCubeExceptionHandlers.add(extendedSingleMethodArgumentNotValidExceptionHandler);
        springMVCCubeExceptionHandlers.add(extendedSingleBindValidationCubeExceptionHandler);
        springMVCCubeExceptionHandlers.add(noHandlerFoundExceptionHandler);
        springMVCCubeExceptionHandlers.add(validationCubeExceptionHandler);
        springMVCCubeExceptionHandlers.add(webCubeExceptionHandler);

        return springMVCCubeExceptionHandlers;

    }

}
