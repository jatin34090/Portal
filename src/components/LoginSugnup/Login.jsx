import Left from "./Left"
import Navbar from "./Navbar"
import LoginRight from "./LoginRight"

const Login = () => {
  return (
    <div className="p-0 m-0 h-screen" >
      <Navbar/>
      <div className="grid grid-cols-12 justify-between h-96">
        <div className="col-span-5">

        <Left/>
        </div >
        <div className="col-span-7 flex justify-center">
<LoginRight/>
        </div>
      </div>
    </div>
  )
}

export default Login