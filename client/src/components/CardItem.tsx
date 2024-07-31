"use client";
import React, { useEffect, useState } from "react";
import { ClockIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { formatTimeAgo } from "../utils/formatTimeLeft";
import CustomDeleteModal from "../utils/Modal/CustomDeleteModal";
import { useDeleteTaskMutation } from "../../redux/features/apiSlice";
import CustomModal from "@/utils/Modal/CustomModal";
import EditTaskForm from "./Task/EditTaskForm";
import { socketId } from "../utils/socket";

type Data = {
  _id: string;
  priority: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
};

type Props = {
  index: number;
  data: Data;
};

const CardItem = ({ index, data }: Props) => {
  const [open, setOpen] = useState<boolean>();
  const [edit, setEdit] = useState<boolean>(false);
  const [deleteTask, { isSuccess }] = useDeleteTaskMutation();
  const handleDelete = async () => {
    await deleteTask(data);
    socketId.emit("tasks", { data: "task deleted" });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);
  return (
    <>
      <div className="bg-[#F9F9F9] border border-[#DEDEDE] rounded-lg p-3  mt-2 ">
        <h5 className="text-md  text-md leading-6 text-[#606060]">
          {data?.title}
        </h5>
        <h3 className="text-md  text-xs font-[300] mb-3 text-[#797979]">
          {data?.description}
        </h3>
        <label
          className={`
                px-2 py-[0.4rem] rounded-lg text-white text-xs font-[300]
                ${
                  data?.priority === "Low"
                    ? "bg-[#0ECC5A]"
                    : data?.priority === "Medium"
                    ? "bg-[#FFA235]"
                    : "bg-[#FF6B6B] "
                }
                `}
        >
          {data.priority}
        </label>
        <div className="flex space-x-2 items-center mt-4">
          <span className="flex space-x-2 items-center text-sm text-[#606060] font-[500]">
            <ClockIcon className="w-6 h-6 " strokeWidth={1.5} />
            <span>{data?.dueDate}</span>
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <div className="flex space-x-2 items-center">
            <span className="flex space-x-1 items-center text-sm font-[400] text-[#797979]">
              <span>{formatTimeAgo(data?.createdAt)}</span>
            </span>
          </div>

          <div className="flex gap-1 text-[#797979]">
            <PencilAltIcon
              className="w-6 h-6 hover:cursor-pointer hover:bg-gray-200 rounded-lg p-1"
              onClick={() => setEdit(true)}
            />
            <TrashIcon
              className="w-6 h-6 hover:cursor-pointer hover:bg-gray-200 rounded-lg p-1"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </div>
      {open && (
        <CustomDeleteModal open={open} setOpen={setOpen} handleFunction={handleDelete} text="Are you sure you want to delete this task ?" />
      )}
      {edit && (
        <CustomModal open={edit} setOpen={setEdit} setRoute={() => {}} component={EditTaskForm} tasks={data} />
      )}
    </>
  );
};

export default CardItem;
