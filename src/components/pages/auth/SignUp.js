import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, CardContent, CardActions, CardHeader, Button } from '@material-ui/core/';
import axios from 'axios';
import User from './User';

const useStyles = makeStyles((theme) => ({
    submitBtn: {
        // marginTop: theme.spacing(2),
        flexGrow: 1
    },
    header: {
        textAlign: 'center',
        background: '#212121',
        color: '#fff'
    },
}));

export default function SignUp(props) {
    const classes = useStyles();

    const [username, setUsername] = useState({value: '', isError: true, helperText: ''});
    const [password, setPassword] = useState({value: '', isError: true, helperText: ''});
    const [passwordConfirmation, setPasswordConfirmation] = useState({value: '', isError: true, helperText: ''});
    const [buttonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (username.isError == false && password.isError == false && passwordConfirmation.isError == false) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }
    }, [username.isError, password.isError, passwordConfirmation.isError]);

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
            case 'passwordConfirmation':
                if(e.target.value != password.value) {
                    setPasswordConfirmation({ value: e.target.value, isError: true, helperText: 'パスワードが一致しません。'});
                } else {
                    setPasswordConfirmation({ value: e.target.value, isError: false, helperText: ''});
                }
                break;
            default:
                console.log('key not found');
        }
    };

    const handleBlur = (e) => {
        switch (e.target.name) {
            case 'username':
                axios.post('http://localhost:3001/users/check', {
                    username: e.target.value,
                }).then(response => {
                    setUsername({ value: e.target.value, isError: response.data.error, helperText: response.data.message});
                }).catch(error => {
                    console.log(error);
                });
                break;
            default:
                console.log('key not found');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/users', {
            username: username.value,
            password: password.value,
        }).then(response => {
            User.set('isLoggedIn', true);
            User.set('id', response.data.id);
            User.set('username', response.data.username);
            User.set('icon', response.data.icon);
            props.handleClose();
        }).catch(error => {
            console.log(error);
        });
    }

    // noValidate autoComplete="off"
    return (
        <form onSubmit={handleSubmit}>
            <CardHeader className={classes.header} title="SignUp" />
            <CardContent>
                    <TextField error={username.helperText.length > 0 && username.isError} helperText={username.helperText} required={true} fullWidth name="username" label="ユーザー名" placeholder="15文字以内で入力" margin="normal" onChange={handleChange} onBlur={handleBlur} />
                    <TextField error={password.helperText.length > 0 && password.isError} helperText={password.helperText} required={true} fullWidth name="password" label="パスワード" placeholder="Password" margin="normal" onChange={handleChange} type="password" />
                    <TextField error={passwordConfirmation.helperText.length > 0 && passwordConfirmation.isError} helperText={passwordConfirmation.helperText} required={true} fullWidth name="passwordConfirmation" label="パスワード確認" placeholder="PasswordConfirmation" margin="normal" onChange={handleChange} type="password" />
            </CardContent>
            <CardActions>
                <Button type="submit" variant="contained" size="large" color="secondary" className={classes.submitBtn} disabled={buttonDisabled}>ユーザー登録</Button>
            </CardActions>
            <CardActions>
                <Button variant="contained" size="large" color="primary" className={classes.submitBtn} onClick={props.handleChangeSignIn}>サインイン</Button>
            </CardActions>
        </form>
    );
}
