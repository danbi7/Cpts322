package com.wsu.crimsonconnect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/{path:^(?!api).*}", "/**/{path:^(?!api).*}"})
    public String redirect() {
        return "forward:/index.html";
    }
}