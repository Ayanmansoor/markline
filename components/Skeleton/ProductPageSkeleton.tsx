import React from 'react'
import ContentLoader from 'react-content-loader'

function ProductPageSkeleton() {
    return (
        <section className='w-full relative  px-3 lg:px-5 '>
            <ContentLoader
                speed={2}
                width={1080}
                height={800}
                viewBox="0 0 1080 900"
                backgroundColor="#D5D5D5"
                foregroundColor="#ecebeb"
                className='  xl:block hidden'
            >
                <rect x="753" y="419" rx="5" ry="5" width="510" height="2" />
                <rect x="147" y="24" rx="0" ry="0" width="540" height="540" />
                <rect x="12" y="25" rx="0" ry="0" width="104" height="109" />
                <rect x="11" y="165" rx="0" ry="0" width="104" height="109" />
                <rect x="11" y="305" rx="0" ry="0" width="105" height="109" />
                <rect x="753" y="27" rx="0" ry="0" width="160" height="18" />
                <rect x="753" y="63" rx="0" ry="0" width="496" height="32" />


                <rect x="753" y="189" rx="0" ry="0" width="45" height="16" />
                <rect x="753" y="224" rx="0" ry="0" width="80" height="80" />
                <rect x="11" y="451" rx="0" ry="0" width="105" height="109" />
                <rect x="73" y="479" rx="0" ry="0" width="2" height="14" />                
                <rect x="753" y="127" rx="20" ry="20" width="101" height="32" />
                <rect x="872" y="128" rx="21" ry="21" width="85" height="32" />
                <rect x="972" y="125" rx="20" ry="20" width="146" height="32" />
                <rect x="1133" y="127" rx="20" ry="20" width="66" height="32" />
                <rect x="828" y="190" rx="0" ry="0" width="175" height="16" />
                <rect x="937" y="194" rx="0" ry="0" width="8" height="8" />
                <rect x="854" y="224" rx="0" ry="0" width="80" height="80" />
                <rect x="954" y="224" rx="0" ry="0" width="80" height="80" />
                <rect x="753" y="309" rx="0" ry="0" width="80" height="5" />
                <rect x="753" y="364" rx="0" ry="0" width="53" height="16" />
                <rect x="828" y="348" rx="25" ry="25" width="432" height="42" />
                <rect x="753" y="459" rx="0" ry="0" width="140" height="32" />
                <rect x="1150" y="521" rx="0" ry="0" width="6" height="4" />
                <rect x="1157" y="496" rx="0" ry="0" width="49" height="5" />
                <rect x="753" y="504" rx="0" ry="0" width="70" height="12" />
                <rect x="753" y="549" rx="25" ry="25" width="435" height="42" />
                <rect x="1101" y="459" rx="25" ry="25" width="48" height="48" />
                <rect x="1213" y="459" rx="25" ry="25" width="48" height="48" />
                <rect x="1172" y="461" rx="0" ry="0" width="16" height="30" />
                <rect x="1212" y="547" rx="25" ry="25" width="48" height="48" />
                <rect x="12" y="627" rx="0" ry="0" width="175" height="18" />
            </ContentLoader>

            <ContentLoader
                speed={2}
                width={'100%'}
                height={800}
                viewBox="0 0 100% 800"
                backgroundColor="#D5D5D5"
                foregroundColor="#ecebeb"
                className=' hidden lg:block  xl:hidden '
            >
                <rect x="147" y="24" rx="0" ry="0" width="540" height="540" />
                <rect x="12" y="25" rx="0" ry="0" width="104" height="109" />
                <rect x="11" y="165" rx="0" ry="0" width="104" height="109" />
                <rect x="11" y="165" rx="0" ry="0" width="104" height="109" />

            </ContentLoader>


            <ContentLoader
                speed={2}
                width={'100%'}
                height={500}
                viewBox="0 0 100% 500"
                backgroundColor="#D5D5D5"
                foregroundColor="#ecebeb"
                className=' block lg:hidden'
            >
                <rect x="1" y="2" rx="0" ry="0" width="584" height="300" />
                <rect x="2" y="330" rx="0" ry="0" width="145" height="121" />
                <rect x="159" y="330" rx="0" ry="0" width="145" height="121" />
                <rect x="316" y="330" rx="0" ry="0" width="145" height="121" />
                <rect x="472" y="330" rx="0" ry="0" width="109" height="121" />
            </ContentLoader>
        </section>
    )
}

export default ProductPageSkeleton
