import { AbstractDocument } from "@app/common/database/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TaskStatus } from "../enums/task-status.enum";
import { TaskPriority } from "../enums/task-priority.enum";

@Schema({ versionKey: false, timestamps: true })
export class Task extends AbstractDocument {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({type:String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({type:String, enum: TaskPriority, required: false })
  priority: TaskPriority;

  @Prop({ required: false })
  dueDate?: Date;

}

export const TaskSchema = SchemaFactory.createForClass(Task)
