import Icon from "/public/icon.png";

export default function Navbar() {
    return (
        <>
            <div className="mx-auto px-2 sm:px-6 lg:px-8 bg-gray-800">
                <div className="relative flex h-16 items-center justify-around">
                    <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center gap-2 text-white">
                            <img
                                alt="IMS"
                                src={Icon}
                                className="h-8 w-auto rounded-sm"
                            />
                            <span>IMS</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
