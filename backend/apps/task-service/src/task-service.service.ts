import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskRequest } from "./dto/create-task.request";
import { TaskRepository } from "./task.repository";
import { Redis } from "ioredis";
import { AUTH_SERVICE } from "@app/common/auth/services";
import { ClientProxy } from "@nestjs/microservices";

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

  async getTasks() {
    return this.taskRepository.find({});
  }

  async updateTasks(taskId: string, updateData: Partial<CreateTaskRequest>) {
    await this.redis.del(taskId);
    return this.taskRepository.findByIdAndUpdate(taskId, updateData);
  }

  async deleteTask(taskId: string) {
    await this.taskRepository.deleteById(taskId);
    await this.redis.del(taskId);
    return { success: "Task deleted successfully" };
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

  async listUsers(){
    return this.authClient.send("list_users", {})
  }
}
