import toast from 'react-hot-toast';

export function toastError(message:string){
    toast(message, {
        duration: 3000,
        position: 'bottom-center',
        style: {
            borderRadius: '0.4rem',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold'
        },
        className: '',
        icon: '❌',
        iconTheme: {
            primary: '#000',
            secondary: '#fff',
        },
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
    });
}

export function toastSuccess(message:string){
    toast(message, {
        duration: 3000,
        position: 'bottom-center',
        style: {
            borderRadius: '0.4rem',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold'
        },
        className: '',
        icon: '✅',
        iconTheme: {
            primary: '#000',
            secondary: '#fff',
        },
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
    });
}

export function toastLoading(message:string){
    toast.loading(message, {
        position: 'bottom-center',
        style: {
            borderRadius: '0.4rem',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold'
        },
        className: '',
        iconTheme: {
            primary: '#000',
            secondary: '#fff',
        },
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
    })
}
