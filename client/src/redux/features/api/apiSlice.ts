// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "@/redux/types/User";
import type { Room } from "@/redux/types/Room";

// Use the `Post` type we've already defined in `postsSlice`,
// and then re-export it for ease of use

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => {
    return {
      // passing the <returnType, parameter for query>
      getUsers: builder.query<User[], void>({
        query: () => "/admin/users",
      }),
      createUser: builder.mutation<User, Omit<User, "id">>({
        query: (user) => ({
          url: "/post",
          method: "POST",
          body: user,
        }),
      }),
      getRooms: builder.query<Room[], void>({
        query: () => "/rooms",
      }),
    };
  },
});

// // Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetUsersQuery, useCreateUserMutation, useGetRoomsQuery } =
  apiSlice;
