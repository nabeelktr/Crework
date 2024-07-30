import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateTaskRequest } from "./dto/create-task.request";
import { TaskRepository } from "./task.repository";
import { Redis } from "ioredis";
import { AUTH_SERVICE } from "@app/common/auth/services";
import { ClientProxy } from "@nestjs/microservices";
import { request } from "express";

@Injectable()
export class TaskServiceService {
  constructor(
    private readonly taskRepository: TaskRepository,
    @Inject("REDIS_CLIENT") private readonly redis: Redis,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
  ) {}

  async createTask(request: CreateTaskRequest) {
    const task: any = await this.taskRepository.create(request);
    await this.redis.set(task._id, JSON.stringify(task), "EX", 3600);
  }

  async getTasks(userId: string) {
    return this.taskRepository.find({ userId });
  }

  async updateTasks(taskId: string, updateData: Partial<CreateTaskRequest>) {
    const task = await this.taskRepository.findById(taskId);

    if (task.userId !== updateData?.userId) {
      throw new UnauthorizedException('User not authorized to update this task');
    }

    await this.redis.del(taskId);
    return this.taskRepository.findByIdAndUpdate(taskId, updateData);
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (task.userId !== userId) {
      throw new UnauthorizedException('User not authorized to delete this task');
    }
    await this.redis.del(taskId);
    return this.taskRepository.deleteById(taskId);
  }

  async getTask(taskId: string) {
    const cachedTask = await this.redis.get(taskId);
    if (cachedTask) {
      return JSON.parse(cachedTask);
    }
    const task = await this.taskRepository.findById(taskId);
    await this.redis.set(taskId, JSON.stringify(task), "EX", 3600);
    return task;
  }

}
