import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props;

    return {
        user: auth?.user || null,
        isAuthenticated: !!auth?.user,
        isSuperAdmin: auth?.user?.role === 'Super Admin',
        organizationId: auth?.user?.organization_id || null,
        branchId: auth?.user?.branch_id || null,
        permissions: auth?.user?.permissions || [],
        can: (permission) => {
            if (auth?.user?.role === 'Super Admin') return true;
            return auth?.user?.permissions?.includes(permission) || false;
        },
    };
}