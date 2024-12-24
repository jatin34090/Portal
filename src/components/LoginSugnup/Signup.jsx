import Left from "./Left";
import Navbar from "./Navbar";
import SignupRight from "./SignupRight";

const Signup = () => {
  return (
    <div className="p-0 m-0">
      <Navbar />
      <div className="grid grid-cols-12  justify-between">
        <div className="col-span-5 ">
          <Left />
        </div>
        <div className="col-span-7 flex justify-center">
          {/* <h3>asd</h3> */}
          <SignupRight />
        </div>
      </div>
    </div>
  );
};
export default Signup;
