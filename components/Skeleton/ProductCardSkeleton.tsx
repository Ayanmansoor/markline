import React from 'react'

import ContentLoader from 'react-content-loader';


function ProductCardSkeleton() {
    return (
        <div style={{ width: '100%', maxWidth: '300px', height: 'auto' }}>
            <ContentLoader
                speed={2}
                viewBox="0 0 300 370"
                backgroundColor="#D5D5D5"
                foregroundColor="#ecebeb"
                style={{ width: '100%', height: 'auto' }}
            >
                <rect x="0" y="0" rx="8" ry="8" width="270" height="230" />
                <rect x="0" y="240" rx="4" ry="4" width="233" height="13" />
                <rect x="0" y="265" rx="4" ry="4" width="268" height="17" />
                <rect x="0" y="295" rx="4" ry="4" width="220" height="35" />
                <rect x="230" y="295" rx="4" ry="4" width="32" height="35" />
            </ContentLoader>
        </div>
    )
}

export default ProductCardSkeleton