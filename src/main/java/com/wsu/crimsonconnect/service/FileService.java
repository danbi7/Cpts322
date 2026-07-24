package com.wsu.crimsonconnect.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {
    private final Path uploadDir = Paths.get("uploads");

    public String save(MultipartFile file) {
        try{
            if(!Files.exists(uploadDir)){
                Files.createDirectories(uploadDir);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        }catch (IOException e){
            throw new RuntimeException("File upload failed", e);
        }
    }
}
