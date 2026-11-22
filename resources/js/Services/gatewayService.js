export const GATEWAY_INITIAL_VALUES = {
    name: '', code: '', logo: null, credentials: {}, is_test_mode: false, is_active: true, sort_order: 0
};
export const mapGatewayToFormData = (g) => ({
    name: g?.name || '', code: g?.code || '', logo: null, 
    credentials: g?.credentials || {}, is_test_mode: g?.is_test_mode ?? false, 
    is_active: g?.is_active ?? true, sort_order: g?.sort_order ?? 0
});