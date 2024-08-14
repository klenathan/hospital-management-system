import { UserContext } from '@/hooks/Auth/UserContext'
import { useContext } from 'react'
import MenuDesktop from '@/components/MenuDesktop'
import MenuMobile from '@/components/MenuMobile'
export default function Dashboard() {
    const { logout, user } = useContext(UserContext)

    return (
        <div className='w-min'>
            <MenuDesktop logout={logout} />
            <MenuMobile logout={logout} />
        </div>
    )
}
