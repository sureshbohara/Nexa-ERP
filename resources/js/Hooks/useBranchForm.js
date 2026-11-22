import { useForm } from '@inertiajs/react';
import { 
    BRANCH_INITIAL_VALUES, 
    mapBranchToFormData 
} from '@/Services/branchService';

export function useBranchForm(branch, isEdit = false) {
    const { data, setData, post, put, processing, errors, reset } = useForm(
        isEdit ? mapBranchToFormData(branch) : BRANCH_INITIAL_VALUES
    );

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? route('branches.update', branch.id) : route('branches.store');
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
        submit,
    };
}