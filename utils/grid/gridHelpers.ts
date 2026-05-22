export const getBentoGridClasses = (index: number): string => {
    const isLarge = index % 7 === 0;
    const isWide = index % 7 === 3;

    if (isLarge) return "md:col-span-2 md:row-span-2";
    if (isWide) return "md:col-span-2";
    return "";
}

