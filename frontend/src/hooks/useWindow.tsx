import { useEffect, useState } from "react";


export function useWindow() {

    const [isDesktopDisplay, setIsDesktopDisplay] = useState(false);
    const [isMobileDisplay, setIsMobileDisplay] = useState(false);
    const [width, setWidth]: any = useState();
    const [height, setHeight]: any = useState();

    function resizeFunction() {
        const h = window.innerHeight;
        const w = window.innerWidth;
        setHeight(h);
        setWidth(w);
        setIsDesktopDisplay(w > 700);
        setIsMobileDisplay(w <= 700);
    }

    useEffect(() => {
        resizeFunction();
        window.addEventListener('resize', resizeFunction)
        return () => window.removeEventListener('resize', resizeFunction)
    }, [])

    return ({
        isMobileDisplay,
        isDesktopDisplay,
        width,
        height
    })
}