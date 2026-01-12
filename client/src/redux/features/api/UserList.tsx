import { useGetUsersQuery } from "./apiSlice";

export default function UserList() {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }
  return (
    <>
      <ul>
        {users?.map((user) => {
          return (
            <li key={user._id}>
              <p>{user.email}</p>
              <p>{user.firstName}</p>
              <p>{user.role}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
