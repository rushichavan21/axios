// import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
const auth = () => {
    const {user , loginWithRedirect,isAuthenticated,logout} =useAuth0();
    console.log("current user :",user);

  return (
    <div>
      auth page
      {isAuthenticated?<button onClick={()=>{logout()}}>Logout</button>:<button onClick={()=>{loginWithRedirect()}}>Login with redirect</button>}

    </div>
  )
}

export default auth
