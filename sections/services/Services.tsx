const Services = () => {
    return (
        <div id="services" className="services flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full">
            <h2 className="text-2xl sm:text-4xl font-bold">Services</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
            <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Photography</div>
            <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Videography</div>
            <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Event Coverage</div>
            </div>
      </div>
    );
}

export default Services;