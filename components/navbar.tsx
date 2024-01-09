import MobileSidebar from "@/components/mobile-sidebar";
import NavbarList from "@/components/navbar-list";
import NavbarAvatar from '@/components/navbar-avatar';


const Navbar = () => {
    return (
        <div className="bg-white border-gray-200 max-w-screen-xl mx-auto p-4 ">
            <div className='flex flex-row justify-between'>
                <div className="flex flex-row">
                <MobileSidebar />
                <NavbarList />
                </div>
                <div className=" space-x-2 flex flex-row justify-end items-center">
                    <div className="flex flex-row space-x-3 items-center">
                        <NavbarAvatar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar