import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignUp from '../auth/signup';

export const CreateAdmin = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const [secure_token, setSecureToken] = React.useState('');

    React.useEffect(() => {
        if(params.has('tkn')) {
            const tkn = params.get('tkn');
            if(tkn !== '') 
                setSecureToken(tkn)
        }
        else setSecureToken('745.kj6m35jknb54m');
    }, []);

    React.useEffect(() => {
        if(secure_token !== '') {
            if(secure_token !== 'M>g[H>@6uiTTl9<Tnped>3=^{5YP}') {
                navigate('/');
            }
        }
    }, [secure_token]);

    return (
        <React.Fragment>
            {
                secure_token === 'M>g[H>@6uiTTl9<Tnped>3=^{5YP}' && (
                    <SignUp key='adminCreateAccount' from='admin' />
                )
            }
        </React.Fragment>
    )
}
