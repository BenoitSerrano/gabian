import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../alert';
import { ApiError } from '../errors';

function useApiCall<apiCallParamsT, apiCallDataT>(props: {
    apiCall: (params: apiCallParamsT) => Promise<apiCallDataT>;
    onSuccess?: (data: apiCallDataT, params: apiCallParamsT) => void;
}) {
    const { displayAlert } = useAlert();

    const mutation = useMutation({
        mutationFn: props.apiCall,
        onSuccess: (data, params) => props.onSuccess?.(data, params),
        onError: (error) => {
            displayAlert({
                variant: 'error',
                text: error instanceof ApiError ? error.message : 'Une erreur est survenue',
            });
            console.error(error);
        },
    });

    return { perform: mutation.mutate, isLoading: mutation.isPending };
}

export { useApiCall };
