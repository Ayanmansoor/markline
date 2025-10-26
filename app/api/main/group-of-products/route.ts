import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";


export async function GET(req: NextRequest) {
    try {
        const groupType = req.nextUrl.searchParams.get("type")
        console.log({ groupType });

        if (!groupType) {
            return NextResponse.json(
                {
                    valid: false,
                    message: "Invalid or missing 'type' parameter. Allowed values: ALL, NEW, LIMITED"
                },
                { status: 400 }
            );
        }



        //     const { data, error } = await mysupabase
        //         .from("product")
        //         .select(`
        //     *,
        //     product_variants (*),
        //     grouptype!inner (
        //       id,
        //       heading,
        //       type,
        //       discription
        //     )
        //   `)
        //         .eq("grouptype.type", groupType);

        let query = mysupabase
            .from("group")
            .select(`
                id,
                heading,
                type,
                discription,
                url,
                urlText,
                products:product (
                    *,
                    product_variants (*)
                )
            `);

        // Apply filter only if type is not ALL
        if (groupType) {
            query = query.eq("type", groupType);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json(
                { valid: false, message: "Error fetching data", error: error.message },
                { status: 500 }
            );
        }

        // If Supabase returns no rows
        if (!data || data.length === 0) {
            return NextResponse.json(
                { valid: false, message: `No products found for group_type: ${groupType}` },
                { status: 404 }
            );
        }

        // Group data by grouptype
        // const groupedMap = data.reduce((acc, product) => {
        //     const group = product.grouptype;
        //     if (!group || !group.id) return acc; // Skip if grouptype is missing

        //     const groupId = group.id;

        //     if (!acc[groupId]) {
        //         acc[groupId] = {
        //             groupdata: { ...group },
        //             products: []
        //         };
        //     }

        //     const { grouptype, ...cleanProduct } = product;
        //     acc[groupId].products.push(cleanProduct);

        //     return acc;
        // }, {});

        // const grouped = Object.values(groupedMap);

        // If grouping resulted in an empty array
        // if (grouped.length === 0) {
        //     return NextResponse.json(
        //         { valid: false, message: `No valid groups found for group_type: ${groupType}` },
        //         { status: 404 }
        //     );
        // }

        // Success response
        return NextResponse.json(
            {
                valid: true,
                message: "Fetched grouped products successfully",
                data: data
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { valid: false, message: "Internal server error", error },
            { status: 500 }
        );
    }
}

