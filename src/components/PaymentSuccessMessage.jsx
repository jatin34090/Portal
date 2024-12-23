const PaymentSuccessMessage = () => {
  return (
    <div className="flex justify-center h-screen items-center ">
            <div className="flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
    
                <img src={tickCircle} alt="" />
                    <div className="text-2xl p-10">
                        Your Payment is Successfull
                    </div>
                    <span>
                        Thank you for your payment.
                    </span>
            </div>
        </div>
  )
}
export default PaymentSuccessMessage