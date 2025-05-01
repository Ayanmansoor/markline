import React from "react";

function FeedbackForm() {
    return (
        <form
            action=""
            className="w-full relative h-auto  flex gap-2 p-5 border  rounded-lg flex-col items-start"
        >
            <h2 className="text-2xl font-medium text-primary">Feedback Form</h2>
            <p className="text-fontPrimary font-medium ">
                Please use the form below to send us your comments and feedback. We
                appreciate you taking the time to provide us with your views so that we
                can best meet the needs of users.
            </p>

            <p className="text-base rounded-xl font-medium mt-4 text-foreground">
                Feedback Description *
            </p>
            <textarea
                name=""
                rows={3}
                className="w-full bg-transparent relative rounded-lg h-auto text-fontPrimary placeholder:text-fontprimary border p-3"
                id=""
                placeholder="Describe Your Feedback here ...."
            ></textarea>

            <p className="text-base font-medium  mt-4 text-foreground ">
                Please tell us what is your feedback related to*
            </p>
            <ul className="w-full relative mt-1 h-auto flex flex-col gap-3">
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="category" />
                    <label
                        htmlFor="category"
                        className="text-base font-medium text-fontprimary"
                    >
                        Category
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="payment" />
                    <label
                        htmlFor="payment"
                        className="text-base font-medium text-fontprimary"
                    >
                        Payment
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="delivary" />
                    <label
                        htmlFor="delivary"
                        className="text-base font-medium text-fontprimary"
                    >
                        Delivery
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="products" />
                    <label
                        htmlFor="products"
                        className="text-base font-medium text-fontprimary"
                    >
                        Products / Account related issues
                    </label>
                </li>
                <li className="w-full relative h-auto flex items-center gap-2 ">
                    <input type="checkbox" id="others" />
                    <label
                        htmlFor="others"
                        className="text-base font-medium text-fontprimary"
                    >
                        Others
                    </label>
                </li>
            </ul>
            <button className=" w-full  relative h-auto px-5 py-1 text-center text-white bg-primary hover:text-primary hover:bg-transparent hover:border-primary border border-transparent rounded-md mt-3 ">
                Submit Feedback
            </button>
        </form>
    );
}

export default FeedbackForm;