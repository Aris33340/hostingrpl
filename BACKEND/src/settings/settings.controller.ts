import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { SettingsService } from "./settings.service";

@Controller('api/settings')
export class SettingsController{
    constructor(private settingsService:SettingsService){}

    @Post()
    async setSettings(@Body() data:{key:string,value:string}){
        return await this.settingsService.createSettings(data)
    }
    @Get()
    async getSettings(){
        return await this.settingsService.getSettings();
    }
    @Put()
    async updateSettings(){

    }
}