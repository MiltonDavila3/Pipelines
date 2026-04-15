import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../features/account/accountApi"

export default function RequiredAuth() {
    const {data: user, isLoading} = useUserInfoQuery();
    const location = useLocation();

    if (isLoading) return <h3>Loading...</h3>

    if (!user) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

  return (
    <Outlet />
  )
}