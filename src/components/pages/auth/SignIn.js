import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, CardContent, CardActions, CardHeader, Button } from '@material-ui/core/';
import { Link } from "react-router-dom";
import User from './User';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    form: {
        width: 450,
    },
    button: {
        marginTop: theme.spacing(2),
        flexGrow: 1
    },
    header: {
        textAlign: 'center',
        background: '#212121',
        color: '#fff'
    },
}));

export default function SignIn(props) {
    const classes = useStyles();

    const [username, setUsername] = useState({value: '', isError: true, helperText: ''});
    const [password, setPassword] = useState({value: '', isError: true, helperText: ''});
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        if (username.isError == false && password.isError == false) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [username.isError, password.isError]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'username':
                if(e.target.value.length >= 15) {
                    setUsername({ value: e.target.value, isError: true, helperText: 'ユーザー名は15文字以内で入力してください。'});
                } else {
                    setUsername({ value: e.target.value, isError: false, helperText: ''});
                }
                break;
            case 'password':
                if(e.target.value.length >= 15) {
                    setPassword({ value: e.target.value, isError: true, helperText: 'パスワードは15文字以内で入力してください。'});
                } else {
                    setPassword({ value: e.target.value, isError: false, helperText: ''});
                }
                break;
            default:
                console.log('key not found');
        }
    };

    const handleLogin = (e) => {
        // User.login(state.username, state.password);

        axios.post('http://localhost:3001/login', {
            username: username.value,
            password: password.value,
        }).then(response => {
            if(response.data.success) {
                User.set('isLoggedIn', true);
                User.set('id', response.data.user.id);
                User.set('username', response.data.user.username);
                User.set('icon', response.data.user.icon);
                props.handleClose();
            } else {
                setLoginError(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <form noValidate autoComplete="off" className={classes.form}>
            <CardHeader className={classes.header} title="SignIn" />
            <CardContent>
                    <TextField error={username.helperText.length > 0 && username.isError} helperText={password.helperText} fullWidth name="username" label="ユーザー名" placeholder="Username" margin="normal" onChange={handleChange} />
                    <TextField error={password.helperText.length > 0 && password.isError} helperText={password.helperText} fullWidth name="password" label="パスワード" placeholder="Password" margin="normal" onChange={handleChange} type="password" />
                    <div style={{color: 'red'}}>{loginError}</div>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="large" color="secondary" className={classes.button} onClick={handleLogin} disabled={buttonDisabled}>サインイン</Button>
            </CardActions>
            <CardActions>
                <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.handleChangeSignUp}>新規登録</Button>
            </CardActions>
        </form>
    );
}
