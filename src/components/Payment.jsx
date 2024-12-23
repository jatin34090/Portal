import axios from "../api/axios"

const payment = () => {

    const checkoutHandler = async () => {

const {data: {key} } =  await axios.get("/api/payment/getKey")

        const response = await axios.post("/api/checkout");
        console.log(response);

        const options = {
            key,
            amount: response.data.amount,
            currency: response.data.currency,
            name: "Acme Corp",
            description: "Test Payment",
            order_id: response.data.id,
            callback_url: "http://localhost:5000/api/paymentverification",

            prefill: {
                name: "Gaurav Kumar",
                email: "5Yt0d@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }

    return (
        <div>payment</div>
    )
}
export default payment