// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "@/redux/types/User";
import type { Room } from "@/redux/types/Room";

// Use the `Post` type we've already defined in `postsSlice`,
// and then re-export it for ease of use

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),

  // We add tags to help the app refresh automatically
  tagTypes: ["User", "Reservation"],

  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // passing the <returnType, parameter for query>
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),
    createUser: builder.mutation<User, Omit<User, "id">>({
      query: (user) => ({
        url: "/post",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    getRooms: builder.query<Room[], void>({
      query: () => "/rooms",
    }),

    /* --- RESERVATION ENDPOINTS --- */
    lookupReservation: builder.query<
      any,
      { confirmationCode: string; email: string; lastName: string }
    >({
      query: (params) => ({
        url: "/reservations/lookup",
        method: "GET",
        params,
      }),
      providesTags: (result) => [{ type: "Reservation", id: result?._id }],
    }),

    // Add this to allow guests to cancel their booking
    cancelReservation: builder.mutation<
      any,
      { id: string; confirmationCode?: string; email?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/reservations/${id}/cancel`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Reservation"],
    }),
  }),
});

// // Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetRoomsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useLazyLookupReservationQuery,
  useCancelReservationMutation,
} = apiSlice;
