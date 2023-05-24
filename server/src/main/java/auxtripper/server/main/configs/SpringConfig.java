package auxtripper.server.main.configs;

import java.util.Set;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SpringConfig {

    @Bean
     public CacheManager cacheManager() {
         // configure and return an implementation of Spring's CacheManager SPI
         SimpleCacheManager cacheManager = new SimpleCacheManager();
         cacheManager.setCaches(Set.of(new ConcurrentMapCache("default")));
         return cacheManager;
         
     }
    
}
