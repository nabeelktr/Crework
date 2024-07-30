import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { CreateTaskRequest } from './dto/create-task.request';
import { JwtAuthGuard } from '@app/common';
import { GetUserId } from './decorator/user.decorator';

@Controller("tasks")
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(@Body() request: CreateTaskRequest, @GetUserId() userId: string) {
    return this.taskServiceService.createTask({...request, userId});
  }

  @Get()
  async getTasks() {
    return this.taskServiceService.getTasks();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTasks(@Body() request: CreateTaskRequest, @Param("id") taskId: string,) {
    return this.taskServiceService.updateTasks(taskId, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param("id") taskId: string){
    return this.taskServiceService.deleteTask(taskId);
  }


  @Get('view/:id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param("id") taskId: string) {
    return this.taskServiceService.getTask(taskId);
  }

  @Get("users")
  async getUser(){ 
    return this.taskServiceService.listUsers();
  }
}
