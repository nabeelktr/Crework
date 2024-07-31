import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/v1/",
  }),
  endpoints: (builder) => ({

    updateTask: builder.mutation({
      query: (data) => ({
        url: `task-service/tasks/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    deleteTask: builder.mutation({
      query: (data) => ({
        url: `task-service/tasks/${data._id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    getTasks: builder.query({
      query: () => ({
        url: "task-service/tasks",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getTask: builder.query({
      query: (data) => ({
        url: `task-service/tasks/view/${data.id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    addTask: builder.mutation({
      query: (data) => ({
        url: "task-service/tasks",
        method: "POST",
        credentials: "include" as const,
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "task-service/tasks/users",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

  }),
});

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useGetUsersQuery
} = apiSlice;
