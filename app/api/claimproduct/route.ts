// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import { mysupabase } from "@/Supabase/SupabaseConfig";

// export async function POST(req:NextRequest) {
//     try{

//         const {token,name,email,orderID,productname,discription}=await req.json()

//         if(!token){
//             return NextResponse.json(   
//                  { error: "reCAPTCHA verification failed" },
//                 { status: 403 }
//                 )
//         }


//         else{

//             const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
//             const verifyResponse = await axios.post(
//                 "https://www.google.com/recaptcha/api/siteverify",
//                 new URLSearchParams({    
//                 secret: recaptchaSecret!,
//                 response: token,
//                 }),
//                 {
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 }
//             );

//             const verifyResult = verifyResponse.data;
//             if (!verifyResult.success) {
//                     return NextResponse.json(
//                     { error: "reCAPTCHA verification failed" },
//                     { status: 403 }
//                     );
//             }

//             const {data,error}=await mysupabase.from("claim-products").insert({
//                 name:name,
//                 email:email,
//                 orderID:orderID,
//                 productname:productname,
//                 discription:discription
//             })
//             if(error){
//                 return NextResponse.json({
//                     error:"something went wrong"
//                 },{
//                     status:400
//                 })
//             }

//             return NextResponse.json({ success: true, data }, { status: 200 });

//         }



//     }
//     catch(error){
//         console.log("error occurr saving")
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});






async function sendClaimEmail(
    customerEmail: string,
    customerName: string,
    claimId: string,
    orderID: string,
    productName: string
): Promise<void> {
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Customer Support'}" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Product Claim Submitted - Claim ID: ${claimId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background-color: #f9f9f9;
                        padding: 30px;
                        border: 1px solid #ddd;
                        border-radius: 0 0 5px 5px;
                    }
                    .claim-id {
                        background-color: #fff;
                        border: 2px solid #4CAF50;
                        padding: 15px;
                        margin: 20px 0;
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                        border-radius: 5px;
                    }
                    .details {
                        background-color: #fff;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                        border: 1px solid #ddd;
                    }
                    .details p {
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✓ Claim Submitted Successfully</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${customerName},</p>
                        
                        <p>Thank you for submitting your product claim. We have received your request and our team will review it shortly.</p>
                        
                        <div class="claim-id">
                            Claim ID: ${claimId}
                        </div>
                        
                        <p><strong>Please save this Claim ID to track your claim status.</strong></p>
                        
                        <div class="details">
                            <h3>Claim Details:</h3>
                            <p><strong>Order ID:</strong> ${orderID}</p>
                            <p><strong>Product Name:</strong> ${productName}</p>
                            <p><strong>Claim ID:</strong> ${claimId}</p>
                            <p><strong>Submitted On:</strong> ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
                        </div>
                        
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your claim within 24-48 hours</li>
                            <li>We may contact you if we need additional information</li>
                            <li>You will receive updates via email</li>
                            <li>Use your Claim ID to track the status</li>
                        </ul>
                        
                        <p>If you have any questions, please reply to this email or contact our support team with your Claim ID.</p>
                        
                        <p>Best regards,<br>Customer Support Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply directly to this message.</p>
                        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,

        text: `
Dear ${customerName},

Thank you for submitting your product claim. We have received your request and our team will review it shortly.

CLAIM ID: ${claimId}

Please save this Claim ID to track your claim status.

Claim Details:
- Order ID: ${orderID}
- Product Name: ${productName}
- Claim ID: ${claimId}
- Submitted On: ${new Date().toLocaleString()}

What happens next?
- Our team will review your claim within 24-48 hours
- We may contact you if we need additional information
- You will receive updates via email
- Use your Claim ID to track the status

If you have any questions, please reply to this email or contact our support team with your Claim ID.

Best regards,
Customer Support Team
        `,
    };

    await transporter.sendMail(mailOptions);
}











// Helper function to upload file to Cloudinary
async function uploadToCloudinary(
    fileBuffer: Buffer,
    filename: string,
    resourceType: "image" | "video"
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: "product-claims",
                public_id: `claim_${Date.now()}_${filename}`,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url || "");
            }
        );

        uploadStream.end(fileBuffer);
    });
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const token = formData.get("token") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const orderID = formData.get("orderID") as string;
        const productname = formData.get("productname") as string;
        const description = formData.get("description") as string;

        // Validate required fields
        if (!token) {
            return NextResponse.json(
                { error: "reCAPTCHA token is required" },
                { status: 400 }
            );
        }

        if (!name || !email || !orderID || !productname || !description) {
            return NextResponse.json(
                { error: "All required fields must be filled" },
                { status: 400 }
            );
        }

        // Verify reCAPTCHA
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const verifyResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            new URLSearchParams({
                secret: recaptchaSecret!,
                response: token,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const verifyResult = verifyResponse.data;
        if (!verifyResult.success) {
            return NextResponse.json(
                { error: "reCAPTCHA verification failed" },
                { status: 403 }
            );
        }

        // Process uploaded files
        const files = formData.getAll("files") as File[];
        const uploadedUrls: string[] = [];

        if (files.length > 0) {
            for (const file of files) {
                try {
                    // Convert file to buffer
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    // Determine resource type
                    const isVideo = file.type.startsWith("video/");
                    const resourceType = isVideo ? "video" : "image";

                    // Upload to Cloudinary
                    const url = await uploadToCloudinary(
                        buffer,
                        file.name,
                        resourceType
                    );
                    uploadedUrls.push(url);
                } catch (uploadError) {
                    console.error(`Error uploading file ${file.name}:`, uploadError);
                    // Continue with other files even if one fails
                }
            }
        }

        // Save to Supabase
        const { data, error } = await mysupabase
            .from("claim-products")
            .insert({
                name: name,
                email: email,
                orderID: orderID,
                productname: productname,
                description: description,
                media_urls: uploadedUrls,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        console.log(data, "this data of  save ", error)


        const claimId = data.claim_id

        if (!claimId) {
            return NextResponse.json(
                { error: "Failed to retrieve claim ID from database" },
                { status: 500 }
            );
        }

        // Send confirmation email to customer
        try {
            await sendClaimEmail(email, name, claimId, orderID, productname);
            console.log(`Confirmation email sent to ${email} with Claim ID: ${claimId}`);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't fail the entire request if email fails
            // The claim is already saved
        }

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { error: "Failed to save claim to database" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Claim submitted successfully",
                data: data,
                uploaded_files: uploadedUrls.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing claim:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}