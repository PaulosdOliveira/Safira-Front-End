'use client'

export const Footer = () => {
    return (

        <footer className=" w-full bottom-0 bg-gray-900 h-fit py-10">

            <div id="dados"
                className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-y-5  justify-items-center">
                <div className="">
                    <img src="/favi_safira.png" alt="Logo safira" />
                    <p className="text-gray-400">&copy; 2025</p>
                </div>
                <div className="text-gray-400 grid">
                    <p className="text-gray-100">Section</p>
                    <a className="cursor-pointer hover:underline" href="#">Home</a>
                    <a className="cursor-pointer hover:underline" href="#">Features</a>
                    <a className="cursor-pointer hover:underline" href="#">Pricing</a>
                    <a className="cursor-pointer hover:underline" href="#">FAQs</a>
                    <a className="cursor-pointer hover:underline" href="#">About</a>
                </div>
                <div className="text-gray-400 grid">
                    <p className="text-gray-100">Section</p>
                    <a className="cursor-pointer hover:underline" href="#">Home</a>
                    <a className="cursor-pointer hover:underline" href="#">Features</a>
                    <a className="cursor-pointer hover:underline" href="#">Pricing</a>
                    <a className="cursor-pointer hover:underline" href="#">FAQs</a>
                    <a className="cursor-pointer hover:underline" href="#">About</a>
                </div>
                <div className="text-gray-400 grid">
                    <p className="text-gray-100">Section</p>
                    <a className="cursor-pointer hover:underline" href="#">Home</a>
                    <a className="cursor-pointer hover:underline" href="#">Features</a>
                    <a className="cursor-pointer hover:underline" href="#">Pricing</a>
                    <a className="cursor-pointer hover:underline" href="#">FAQs</a>
                    <a className="cursor-pointer hover:underline" href="#">About</a>
                </div>

            </div>
            <hr className="w-[87vw] text-gray-500 m-auto mt-14 mb-4" />
            <div className="flex flex-row-reverse w-[87vw] m-auto">
                <a href="https://github.com/PaulosdOliveira" target="_blank"><img src="github_icon.png" alt="Icone github" height="28px" width="28px" /></a>
            </div>
        </footer>
    )
}