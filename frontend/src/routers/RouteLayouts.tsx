import AppointmentManagement from '@/layouts/AppointmentManagement';
import StaffManagement from '@/layouts/StaffManagement';

export const RouteKeys = {
    staff: 'staff',
    appointment: 'appointment',
}

export const RouteLayoutMap: Record<keyof typeof RouteKeys, { component: React.FunctionComponent; allowAll: boolean }> =
{
    staff: { component: StaffManagement, allowAll: true },
    appointment: { component: AppointmentManagement, allowAll: true }
}
