import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function usePermissions() {
    const { auth } = usePage().props;

    const permissions = useMemo(() => {
        return auth?.user?.permissions || [];
    }, [auth]);

    const can = (permission) => {
        if (auth?.user?.role === 'Super Admin') return true;
        return permissions.includes(permission);
    };

    const canAny = (permissionList) => {
        if (auth?.user?.role === 'Super Admin') return true;
        return permissionList.some(p => permissions.includes(p));
    };

    return { permissions, can, canAny };
}