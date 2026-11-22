import { useForm } from '@inertiajs/react';
import { ROLE_INITIAL_VALUES, mapRoleToFormData } from '@/Services/roleService';

export function useRoleForm(role, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapRoleToFormData(role) : ROLE_INITIAL_VALUES
    );

    const togglePermission = (permissionId) => {
        const current = data.permissions || [];
        if (current.includes(permissionId)) {
            setData('permissions', current.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...current, permissionId]);
        }
    };

    const toggleModule = (modulePermissions) => {
        const current = data.permissions || [];
        const moduleIds = modulePermissions.map(p => p.id);
        const allSelected = moduleIds.every(id => current.includes(id));
        
        if (allSelected) {
            setData('permissions', current.filter(id => !moduleIds.includes(id)));
        } else {
            setData('permissions', [...new Set([...current, ...moduleIds])]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('roles.update', role.id) : route('roles.store');
        const request = isEdit ? put : post;

        request(url, data, {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
            },
        });
    };

    return {
        data, setData, processing, errors, reset,
        togglePermission, toggleModule, submit,
    };
}