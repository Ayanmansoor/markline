import React from 'react'
import ContentLoader from 'react-content-loader';

function MegaManuCarSkeleton() {
    return (
        <ContentLoader
            speed={2}
            width={241}
            height={170}
            viewBox="0 0 241 170"
            backgroundColor="#D5D5D5"
            foregroundColor="#ecebeb"
        >
            <rect x="21" y="261" rx="0" ry="0" width="227" height="0" />
            <rect x="6" y="19" rx="0" ry="0" width="124" height="108" />
            <rect x="7" y="136" rx="0" ry="0" width="95" height="5" />
            <rect x="287" y="342" rx="0" ry="0" width="3" height="2" />
            <rect x="6" y="148" rx="0" ry="0" width="123" height="17" />
        </ContentLoader>
    )
}

export default MegaManuCarSkeleton