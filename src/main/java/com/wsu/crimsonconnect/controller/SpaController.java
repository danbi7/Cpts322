package com.wsu.crimsonconnect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping("/{path:^(?!api$).*$}")
    public String forward() {
        return "index.html";
    }
}
