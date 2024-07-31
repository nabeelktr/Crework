"use client";
import React, { useEffect, useState } from "react";
import BoardData from "../../data/board-data.json";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../../../redux/features/apiSlice";
import Loader from "../../utils/Loader/Loader";
import DroppableColumn from "../DroppableColumn";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../utils/Modal/CustomModal";
import AddTaskForm from "../Task/AddTaskForm";
import { socketId } from "../../utils/socket";
import TaskModal from "../Task/TaskModal";
import { useDrawer } from "@/contexts/DrawerContext";

type Props = {};

const Dashboard = (props: Props) => {
  const {isDrawerOpen, setDrawerOpen} = useDrawer()
  const {
    data: tasks,
    isSuccess,
    isLoading: getTasksLoad,
    refetch,
  } = useGetTasksQuery({}, {refetchOnMountOrArgChange: true});

  const [updateTask, { isSuccess: isTaskUpdated, isError, isLoading }] =
    useUpdateTaskMutation();
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState(BoardData);
  const { open, setOpen } = useModal();
  const [add, setAdd] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    if (isSuccess && tasks) {
      setBoardData(tasks);
    }
  }, [isSuccess, tasks]);
  useEffect(() => {
    if (isError) {
      setOpen(true);
    }
    if (isTaskUpdated) {
      // refetch();
    }
  }, [isTaskUpdated, isError]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    const taskIndex = boardData.findIndex(
      (task: any) => task._id === draggableId
    );
    if (taskIndex === -1) return;
    const updatedTask = {
      ...boardData[taskIndex],
      status: destination.droppableId,
    };
    const newBoardData = Array.from(boardData);
    newBoardData.splice(taskIndex, 1);
    newBoardData.splice(destination.index, 0, updatedTask);
    setBoardData(newBoardData);
    await updateTask(updatedTask);
    socketId.emit("tasks", {data: "task status updated"})
  };

  useEffect(() => {
   socketId.on("onTaskUpdate", ()=> {
    refetch()
   }) 
   return () => {
    socketId.off();
  };
  })

  if (getTasksLoad) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col font-Poppins bg-white mt-4 rounded-lg">
       {isDrawerOpen !== "" && <TaskModal />}
      {isLoading && <Loader />}
      {ready && boardData && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 min-h-[38rem] pr-4">
            <DroppableColumn
              droppableId="To do"
              tasks={boardData}
              title="To do"
              setAdd={setAdd}
            />
            <DroppableColumn
              droppableId="In progress"
              tasks={boardData}
              title="In progress"
            />
            <DroppableColumn
              droppableId="Under review"
              tasks={boardData}
              title="Under review"
            />
            <DroppableColumn
              droppableId="Finished"
              tasks={boardData}
              title="Finished"
            />
          </div>
        </DragDropContext>
      )}
      {add && (
        <CustomModal
          open={add}
          setOpen={setAdd}
          setRoute={() => {}}
          component={AddTaskForm}
        />
      )}
    </div>
  );
};

export default Dashboard;
