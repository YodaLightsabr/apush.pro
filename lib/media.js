const { useMediaQuery } = require("@geist-ui/core")

export default function useMedia () {
    const isXS = useMediaQuery('xs')
    const isSM = useMediaQuery('sm')
    const isMD = useMediaQuery('md')
    const isLG = useMediaQuery('lg')
    const isXL = useMediaQuery('xl')

    console.log({
        isXS,
        isSM,
        isMD,
        isLG,
        isXL
    })

    const media = {
        xs: isXS || isSM || isMD || isLG || isXL,
        sm: isSM || isMD || isLG || isXL,
        md: isMD || isLG || isXL,
        lg: isLG || isXL,
        xl: isXL,
    };
    return media;
}
