// import { ModeToggle } from '@/components/Theme/mode-toggle'
// import { Badge } from '@/components/ui/badge'
// import { User } from '@/types/user'
import { AlignRight, CircleUserRound, LogOutIcon, Users, Hospital, CalendarDays, ClipboardList, HeartPulse } from 'lucide-react'
import { ReactNode, useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { UserContext } from '@/hooks/Auth/UserContext'

interface MenuMobileProps {
  // user: User
  logout: () => void
}

/**
 * MenuMobile component for rendering the mobile version of the menu.
 *
 * @param {Object} props
 * @param {User} props.user
 * @param {Function} props.logout
 *
 * @example
 * const user = { id: 1, name: "John Doe" };
 * <MenuMobile user={user} logout={handleLogout} />
 */

/**
 * MenuMobile component for rendering the mobile version of the menu.
 *
 * @param {Object} props
 * @param {User} props.user
 * @param {Function} props.logout
 *
 * @example
 * const user = { id: 1, name: "John Doe" };
 * <MenuMobile user={user} logout={handleLogout} />
 */

const MenuMobile: React.FC<MenuMobileProps> = ({ logout }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { user } = useContext(UserContext)

  return (
    <div className='block top-0 right-0 left-0 z-30 fixed lg:hidden bg-background shadow px-5 border w-full select-none botder-mute'>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex justify-between items-center'>
          <div className={`relative flex items-center w-full h-16 justify-start gap-5`}>
            <div className={`flex justify-center items-center`}><Hospital /></div>
            <h2 className={`font-semibold text-xl xl:text-2xl text-archivo text-foreground w-max opacity-100`}>
              Hospital
            </h2>
          </div>
        </div>
        <div className='flex flex-row justify-center items-center gap-4'>
          {/* <ModeToggle /> */}
          <Sheet open={isSheetOpen} onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}>
            <SheetTrigger asChild>
              <AlignRight onClick={() => setIsSheetOpen(true)} />
            </SheetTrigger>
            <SheetContent className='flex flex-col justify-between items-start'>
              <SheetHeader className='w-full'>
                <SheetTitle></SheetTitle>
                <SheetDescription>


                  {user.job_type === 'Admin' &&
                    <>
                      <SidebarItem to='/staff' icon={<Users />} text='Staff' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/reports' icon={<ClipboardList />} text='Reports ' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/appointment' icon={<CalendarDays />} text='Appointment' onClick={() => setIsSheetOpen(false)} />
                    </>
                  }
                  {user.job_type === 'Doctor' &&
                    <>
                      <SidebarItem to='/patient' icon={<HeartPulse />} text='Patient' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/appointment' icon={<CalendarDays />} text='Appointment' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/reports' icon={<ClipboardList />} text='Reports ' onClick={() => setIsSheetOpen(false)} />
                    </>
                  }
                  {user.job_type === 'Nurse' &&
                    <>
                      <SidebarItem to='/patient' icon={<HeartPulse />} text='Patient' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/appointment' icon={<CalendarDays />} text='Appointment' onClick={() => setIsSheetOpen(false)} />
                      <SidebarItem to='/reports' icon={<ClipboardList />} text='Reports ' onClick={() => setIsSheetOpen(false)} />
                    </>
                  }
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className='flex flex-col w-full'>
                <div className='relative flex items-center my-1 px-3 pt-2 rounded-md font-semibold transition-colors group'>
                  <CircleUserRound className='bg-primary rounded-full text-background' />
                  <div className={`flex justify-between items-center overflow-hidden transition-all flex-1 ml-3`}>
                  </div>
                </div>
                <SidebarItem
                  to='/login'
                  icon={<LogOutIcon />}
                  text='Logout'
                  className='!text-destructive'
                  onClick={logout}
                />
              </SheetFooter>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </div>
  )
}

export default MenuMobile

interface SidebarItemProps {
  icon: ReactNode
  text: string
  to: string
  className?: string
  onClick?: () => void
}

export function SidebarItem({ icon, text, to, className, onClick }: SidebarItemProps) {
  return (
    <NavLink
      onClick={onClick}
      to={to}
      className={({ isActive }) => `
        relative flex items-center py-3 2lg:py-4 xl:py-4 2xl:py-6 px-3 my-1 font-semibold rounded-md cursor-pointer transition-colors group ${className}
        ${isActive ? 'bg-secondary text-primary' : 'hover:bg-secondary text-foreground'}
      `}
    >
      {icon}
      <span className={`overflow-hidden transition-all flex-1 ml-3`}>{text}</span>
    </NavLink>
  )
}
