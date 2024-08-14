import { version } from '@/../package.json'
// import { ModeToggle } from '@/components/Theme/mode-toggle'
import { ChevronRight, CircleUserRound, LineChart, LogOutIcon, Users, Hospital } from 'lucide-react'
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
          className='top-1/2 -right-2 z-20 absolute bg-accent hover:bg-accent-foreground shadowd p-1.5 rounded-full'
        >
          {/* {expanded ? <ChevronFirst /> : <ChevronRight />} */}
          <ChevronRight
            strokeWidth={3}
            className={` ${expanded && '-rotate-180'
              } font-bold transition duration-500 ease-in-out w-4  h-4 2lg:w-3  2lg:h-3`}
          />
        </button>

        <SidebarContext.Provider value={{ expanded }}>
          <div className='px-3'>
            <SidebarItem to='/' icon={<Hospital />} text='Hospital' />
          </div>
        </SidebarContext.Provider>

        <SidebarContext.Provider value={{ expanded }}>
          <div className='flex-1 px-3'>
            <SidebarItem to='/' icon={<LineChart />} text='Analysis' />
            {/* {user.is_admin && (
              <>
                <SidebarItem to='/admin' icon={<Users />} text='Accounts' />
              </>
            )} */}
          </div>
        </SidebarContext.Provider>

        <SidebarContext.Provider value={{ expanded }}>
          <div className={`p-3 border-t cursor-default`}>
            <div className='relative flex items-center my-1 rounded-md font-semibold transition-colors group'>
              <div className={`flex justify-center items-center  ${expanded ? 'w-min' : 'w-full'}`}>
                {/* <ModeToggle /> */}
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
          </div>

          <div className={`px-3 border-t cursor-default`}>
            <div className='relative flex items-center my-1 px-3 pt-2 rounded-md font-semibold transition-colors group'>
              <CircleUserRound className='bg-primary rounded-full text-background' />
              <div
                className={` flex justify-between items-center overflow-hidden transition-all ${expanded ? 'flex-1 ml-3' : ' opacity-0 !w-0'
                  } `}
              >
                {/* <div className='flex flex-col justify-start items-start'>
                  <div className='font-semibold text-lg'>{user.username}</div>
                  <Badge variant='outline' className={`${user.is_admin ? 'bg-lime-200' : 'bg-sky-200'} text-black`}>
                    {user.is_admin ? 'Admin' : 'User'}
                  </Badge>
                </div> */}
              </div>
            </div>
          </div>
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
          className={`absolute left-full rounded-md px-2 py-1 ml-6 shadow-md bg-background text-foreground text-sm invisible opacity-20 -translate-x-3 transition-all !duration-0 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 w-max`}
        >
          {text}
        </div>
      )}
    </NavLink>
  )
}
