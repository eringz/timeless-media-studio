
interface SectionHeadingProps {
  title: string;
  children?: React.ReactNode;
}

const SectionHeading = ({ title, children }: SectionHeadingProps) => {
    return (
        <h2 
            className="flex justify-center items-center text-4xl font-bold"
        >
            <span 
                className="bg-[#101828] px-8 py-4 w-[420px] rounded text-white text-center shadow-xl "
            >
                { children || title}
            </span>
        </h2>
    );
}

export default SectionHeading