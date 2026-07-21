package com.ims.platform.logging.config;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.ims.platform.logging.aspect.ExceptionLoggingAspect;
import com.ims.platform.logging.exception.DefaultExceptionLogger;
import com.ims.platform.logging.exception.ExceptionLogger;
import com.ims.platform.logging.filter.CorrelationIdFilter;
import com.ims.platform.logging.filter.RequestLoggingFilter;
import com.ims.platform.logging.generator.CorrelationIdGenerator;
import com.ims.platform.logging.generator.DefaultCorrelationIdGenerator;
import com.ims.platform.logging.holder.DefaultRequestContextHolder;
import com.ims.platform.logging.holder.RequestContextHolder;
import com.ims.platform.logging.properties.LoggingProperties;

@AutoConfiguration
@EnableConfigurationProperties(LoggingProperties.class)
public class LoggingAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "platform.request-context", name = "enabled", havingValue = "true", matchIfMissing = true)
    public RequestContextHolder requestContextHolder() {
        return new DefaultRequestContextHolder();
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "platform.request-context", name = "enabled", havingValue = "true", matchIfMissing = true)
    public CorrelationIdGenerator correlationIdGenerator() {
        return new DefaultCorrelationIdGenerator();
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "platform.request-context", name = "enabled", havingValue = "true", matchIfMissing = true)
    public CorrelationIdFilter correlationIdFilter(
            LoggingProperties properties,
            CorrelationIdGenerator correlationIdGenerator,
            RequestContextHolder requestContextHolder) {

        return new CorrelationIdFilter(properties, correlationIdGenerator, requestContextHolder);
    }

    @Bean
    @ConditionalOnMissingBean(name = "correlationIdFilterRegistration")
    @ConditionalOnProperty(prefix = "platform.request-context", name = "enabled", havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<CorrelationIdFilter> correlationIdFilterRegistration(
            CorrelationIdFilter filter,
            LoggingProperties properties) {

        FilterRegistrationBean<CorrelationIdFilter> registration = new FilterRegistrationBean<>();

        registration.setFilter(filter);
        registration.addUrlPatterns("/*");
        registration.setOrder(properties.getFilterOrderHighest());

        return registration;
    }

    @Bean
    @ConditionalOnProperty(prefix = "platform.logging.exception-logging", name = "enabled", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean
    public ExceptionLogger exceptionLogger() {
        return new DefaultExceptionLogger();
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "platform.logging.exception-logging", name = "enabled", havingValue = "true", matchIfMissing = true)
    public ExceptionLoggingAspect exceptionLoggingAspect(
            ExceptionLogger exceptionLogger) {

        return new ExceptionLoggingAspect(exceptionLogger);
    }

    @Bean
    @ConditionalOnProperty(prefix = "platform.logging.request", name = "enabled", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean
    public RequestLoggingFilter requestLoggingFilter(
            LoggingProperties properties) {

        return new RequestLoggingFilter(properties);
    }

    @Bean
    @ConditionalOnProperty(prefix = "platform.logging.request", name = "enabled", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean
    public FilterRegistrationBean<RequestLoggingFilter> requestLoggingFilterRegistration(
            RequestLoggingFilter filter,
            LoggingProperties properties) {

        FilterRegistrationBean<RequestLoggingFilter> registration = new FilterRegistrationBean<>();

        registration.setFilter(filter);
        registration.addUrlPatterns("/*");
        registration.setOrder(properties.getRequest().getRequestLoggingFilterOrder());

        return registration;
    }

}