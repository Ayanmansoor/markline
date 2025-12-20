'use client'

import React, { useEffect, useState } from 'react'
import CartSection from '../Common/CartSection'

function Cartpage() {
    // const [suggestProducts, setSuggestProducts] = useState<suggestedProps[]>([])
    // const [loading, setLoading] = useState(true);

    // const [products, setProducts] = useState<ProductProps[]>([])

    // async function getAllProducts() {
    //     try {
    //         const { data } = await apiClient.get('/user/products')
    //         setProducts(data.product)
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }



    // async function suggestedProduct() {
    //     try {
    //         setLoading(true);
    //         const { data } = await apiClient.get('/user/suggested');
    //         setSuggestProducts(data.suggested);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false); // stop loading
    //     }
    // }
    // useEffect(() => {
    //     suggestedProduct()
    //     getAllProducts()
    // }, [])

    return (
        <>
            <CartSection />
            {/* <CustomSection className=" gap-5 lg:gap-10 py-10 lg:py-16" isSlider={true} heading={"You might like"} link="/" linktext="View All" >
                <ProductsSection products={products} sekeltoncss=' w-[250px] lg:w-[300px]' />
            </CustomSection>


            {
                suggestProducts?.length > 0 &&
                suggestProducts.slice(0, 1).map((item, index) => (
                    <CustomSection className=" gap-5 lg:gap-10 py-10 lg:py-16" heading={`Saved for Later`} link="/products" linktext="See All" subtitle={`${item?.subtitle}`} key={index}>
                        <ProductsSection products={item.Product} loading={loading} />
                    </CustomSection>
                ))
            } */}






        </>
    )
}

export default Cartpage