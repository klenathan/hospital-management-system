// import { ModeToggle } from '@/components/Theme/mode-toggle'
import { ChevronRight, LogOutIcon, Users, Hospital, CalendarDays, ClipboardList, HeartPulse } from 'lucide-react'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarContextType {
  expanded: boolean
}

interface MenuDesktopProps {
  logout: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

/**
 * MenuDesktop component for rendering the desktop version of the menu.
 *
 * @param {Object} props
 * @param {User} props.user
 * @param {Function} props.logout
 *
 * @example
 * <MenuDesktop user={user} logout={handleLogout} />
 */
const MenuDesktop: React.FC<MenuDesktopProps> = ({ logout }) => {
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    // Function to check the screen size and set expanded state
    const checkScreenSize = () => {
      if (window.innerWidth <= 1024) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return (
    <aside className='lg:block top-0 left-0 z-10 sticky hidden py-6 pl-2 h-screen select-none'>
      <nav className='relative flex flex-col bg-card shadow-sm pb-3 border rounded-2xl h-full'>
        <button
          role='button'
          id='expandButton'
          aria-label='Expand Menu'
          onClick={() => setExpanded((curr) => !curr)}
          className='top-1/2 -right-2 z-20 absolute bg-gray-200 hover:bg-gray-400 shadowd p-1.5 rounded-full'
        >
          {/* {expanded ? <ChevronFirst /> : <ChevronRight />} */}
          <ChevronRight
            strokeWidth={3}
            className={` ${expanded && '-rotate-180'
              } font-bold transition duration-500 ease-in-out w-4  h-4 2lg:w-3  2lg:h-3`}
          />
        </button>
        <div className='z-10 flex justify-between items-center p-4 !pb-2'>
          <NavLink
            to='/'
            className={` relative flex  items-center h-16 w-full ${expanded ? 'justify-start gap-5' : 'justify-between'
              }`}
          >
            <div className={`flex justify-center items-center  ${expanded ? 'w-min' : 'w-full'}`}><Hospital /></div>
            <h2
              className={`font-semibold text-xl xl:text-2xl text-archivo text-foreground ${expanded ? ' w-max opacity-100' : '!w-0 opacity-0'
                }`}
            >
              Hospital
            </h2>
          </NavLink>
        </div>


        <SidebarContext.Provider value={{ expanded }}>
          <div className='flex-1 px-3'>
            <SidebarItem to='/patient' icon={<HeartPulse />} text='Patient' />
            <SidebarItem to='/staff' icon={<Users />} text='Staff' />
            <SidebarItem to='/appointment' icon={<CalendarDays />} text='Appointment ' />
            <SidebarItem to='/reports' icon={<ClipboardList />} text='Reports ' />
            {/* {user.is_admin && (
              <>
                <SidebarItem to='/admin' icon={<Users />} text='Accounts' />
              </>
            )} */}
          </div>
        </SidebarContext.Provider>

        <SidebarContext.Provider value={{ expanded }}>
          {/* <div className={`p-3 border-t cursor-default`}>
            <div className='relative flex items-center my-1 rounded-md font-semibold transition-colors group'>
              <div className={`flex justify-center items-center  ${expanded ? 'w-min' : 'w-full'}`}>
              </div>
              <div
                className={` overflow-hidden transition-all h-full flex justify-start items-center ${expanded ? 'flex-1 ml-3' : 'opacity-0 !w-0'
                  }`}
              >
                Theme
              </div>
              {!expanded && (
                <div
                  className={`absolute left-full rounded-md px-2 py-1 ml-6 shadow-md bg-background text-foreground text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 w-max`}
                >
                  Theme
                </div>
              )}
            </div>
          </div> */}

          {/* <div className={`px-3 border-t cursor-default`}>
            <div className='relative flex items-center my-1 px-3 pt-2 rounded-md font-semibold transition-colors group'>
              <CircleUserRound className='bg-primary rounded-full text-background' />
              <div
                className={` flex justify-between items-center overflow-hidden transition-all ${expanded ? 'flex-1 ml-3' : ' opacity-0 !w-0'
                  } `}
              >
              </div>
            </div>
          </div> */}
          <div className='px-3' onClick={logout}>
            <SidebarItem to='/login' active={false} icon={<LogOutIcon />} text='Logout' className='!text-destructive' />
          </div>
        </SidebarContext.Provider>
      </nav>
    </aside>
  )
}

export default MenuDesktop

interface SidebarItemProps {
  icon: ReactNode
  text: string
  active?: boolean
  alert?: boolean
  to: string
  className?: string
}

/**
 * SidebarItem component for rendering an item in the sidebar.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.text
 * @param {boolean} [props.active]
 * @param {boolean} [props.alert]
 * @param {string} props.to
 * @param {string} [props.className]
 *
 */
export function SidebarItem({ icon, text, active, to, className }: SidebarItemProps) {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('SidebarItem must be used within a SidebarContext.Provider')
  }

  const { expanded } = context

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative flex items-center py-3 2lg:py-4 xl:py-4 2xl:py-6 my-1  px-3 font-semibold rounded-md cursor-pointer transition-colors group ${className}


        ${isActive || active ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'}
      `}
    >
      <div className={`flex justify-center items-center  ${expanded ? 'w-min' : 'w-full'}`}>{icon}</div>
      <span className={`overflow-hidden transition-all ${expanded ? 'flex-1 ml-3' : 'opacity-0 !w-0'}`}>{text}</span>
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 shadow-md bg-background text-foreground text-sm invisible border -translate-x-3 transition-all !duration-0 group-hover:visible group-hover:!opacity-100 group-hover:translate-x-0 w-max`}
        >
          {text}
        </div>
      )}
    </NavLink>
  )
}
