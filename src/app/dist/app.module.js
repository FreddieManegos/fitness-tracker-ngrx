"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var animations_1 = require("@angular/platform-browser/animations");
var app_component_1 = require("./app.component");
var material_module_1 = require("./material.module");
var signup_component_1 = require("./auth/signup/signup.component");
var login_component_1 = require("./auth/login/login.component");
var training_component_1 = require("./training/training.component");
var current_training_component_1 = require("./training/current-training/current-training.component");
var new_training_component_1 = require("./training/new-training/new-training.component");
var pass_training_component_1 = require("./training/pass-training/pass-training.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                signup_component_1.SignupComponent,
                login_component_1.LoginComponent,
                training_component_1.TrainingComponent,
                current_training_component_1.CurrentTrainingComponent,
                new_training_component_1.NewTrainingComponent,
                pass_training_component_1.PassTrainingComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                material_module_1.MaterialModule
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
