package com.wsu.crimsonconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Serves files saved by FileService (in the local "uploads" directory) at /uploads/**.
 *
 * NOTE: Render's free tier (and most PaaS free tiers) use an ephemeral filesystem —
 * uploaded files will NOT survive a redeploy or restart. This is fine for demoing the
 * feature but is a known limitation documented in the README. A future improvement is
 * to swap FileService to write to S3-compatible object storage (e.g. Cloudflare R2 free tier).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadsPath = Path.of("uploads").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsPath);
    }
}
