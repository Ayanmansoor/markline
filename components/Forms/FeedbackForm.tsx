'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import z from 'zod'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import React, { useState } from "react";
import { toast } from 'sonner'

const feedbackSchema = z.object({
    message: z.string(),
    point: z.array(z.string()).min(1, "Please select at least one category") // Ensure that point is always an array with at least one item
})

type FormInputs = z.infer<typeof feedbackSchema>;

function FeedbackForm() {

    const [submitting, setSubmitting] = useState(false)
    const { executeRecaptcha } = useGoogleReCaptcha()

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormInputs>({
        resolver: zodResolver(feedbackSchema)
    })

    async function onSubmit(data: FormInputs) {
        if (!executeRecaptcha) {
            return;
        }
        const token = await executeRecaptcha()
        setSubmitting(true)
        try {
            const response = await axios.post(`/api/feedbackform`, {
                token: token,
                message: data.message,
                point: data.point
            })
            setSubmitting(false)
            console.log(response.data);
            toast.success("Thank you ! For your feedback")
        }
        catch (error) {
            setSubmitting(false)
            console.log(error)
            toast.error("Error occure while creating feedback ")
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full relative h-auto flex gap-2 p-5 border rounded-lg flex-col items-start"
        >
            <h2 className="text-2xl font-medium text-primary">Feedback Form</h2>
            <p className="text-fontPrimary font-medium">
                Please use the form below to send us your comments and feedback. We
                appreciate you taking the time to provide us with your views so that we
                can best meet the needs of users.
            </p>

            <p className="text-base rounded-xl font-medium mt-4 text-foreground">
                Feedback Description *
            </p>
            <textarea
                {...register("message")}
                rows={3}
                className="w-full bg-transparent relative rounded-lg h-auto text-fontPrimary placeholder:text-fontprimary border p-3"
                placeholder="Describe Your Feedback here ...."
            ></textarea>

            <p className="text-base font-medium mt-4 text-foreground">
                Please tell us what is your feedback related to*
            </p>

            <Controller
                name="point"
                control={control}
                defaultValue={[]} // Set default value to an empty array
                render={({ field }) => (
                    <ul className="w-full relative mt-1 h-auto flex flex-col gap-3">
                        {["category", "payment", "delivery", "products", "others"].map((option) => (
                            <li key={option} className="w-full relative h-auto flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={option}

                                    {...field}
                                    checked={field.value?.includes(option)} // Track checked state
                                    onChange={(e) => {
                                        const currentValue = field.value || []; // Ensure it's always an array
                                        if (e.target.checked) {
                                            field.onChange([...currentValue, option]) // Add selected value to array
                                        } else {
                                            field.onChange(currentValue.filter((item: string) => item !== option)) // Remove value from array
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={option}
                                    className="text-base font-medium text-fontprimary"
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            />
            <button className="w-full relative h-auto px-5 py-1 text-center text-white bg-primary hover:text-primary hover:bg-transparent hover:border-primary border border-transparent rounded-md mt-3">
                {submitting ? "Submitting..." : "Submit Feedback"}
            </button>

            {errors.point && (
                <p className='text-base font-medium text-primary'>
                    {errors.point.message}
                </p>
            )}

        </form>
    );
}

export default FeedbackForm;
