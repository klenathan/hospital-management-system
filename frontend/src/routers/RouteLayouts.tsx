import Admin from '@/layouts/Dashboard'
// import Upload from '@/layouts/Upload'

export const RouteKeys = {
    dashboard: 'dashboard',
    // upload: 'upload'
}

export const RouteLayoutMap: Record<keyof typeof RouteKeys, { component: React.FunctionComponent; allowAll: boolean }> =
{
    dashboard: { component: Admin, allowAll: true },
    // upload: { component: Upload, allowAll: false }
}
