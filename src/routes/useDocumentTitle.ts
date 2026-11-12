import { useEffect } from 'react';

function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = `${title} - Gabian`;
    }, [title]);
}

export { useDocumentTitle };
