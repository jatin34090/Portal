import ErrorIcon from "../assets/errorIcon.png"

const ShowMessage = () => {
  return (
    <>
    
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl p-6 rounded-lg">
            <img className="m-auto" src={ErrorIcon} alt="" />
            <div className="p-12 text-2xl text-gray-400">
                Error message
            </div>
    </div>
    </>
  )
}
export default ShowMessage