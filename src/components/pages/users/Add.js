import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Card, CardContent, CardActions, CardHeader, Button, Modal } from '@material-ui/core/';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    loginBtn: {
        marginTop: theme.spacing(2),
        flexGrow: 1
    },
    header: {
        textAlign: 'center',
        background: '#212121',
        color: '#fff'
    },
    card: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: theme.spacing(10),
        width: 400,
    }
}));

export default function Add(props) {
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
                if(e.target.value == 'kouki') {
                    setUsername({ value: e.target.value, isError: true, helperText: 'このユーザー名は既に使われています。'});
                } else {
                    setUsername({ value: e.target.value, isError: false, helperText: ''});
                }
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
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        });
    }

    const history = useHistory();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        history.goBack();
        setOpen(false);
    };

    // noValidate autoComplete="off"
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
            <Card className={classes.card}>
                <form onSubmit={handleSubmit}>
                    <CardHeader className={classes.header} title="ユーザー登録" />
                    <CardContent>
                            <TextField error={username.helperText.length > 0 && username.isError} helperText={username.helperText} required={true} fullWidth name="username" label="ユーザー名" placeholder="15文字以内で入力" margin="normal" onChange={handleChange} onBlur={handleBlur} />
                            <TextField error={password.helperText.length > 0 && password.isError} helperText={password.helperText} required={true} fullWidth name="password" label="パスワード" placeholder="Password" margin="normal" onChange={handleChange} type="password" />
                            <TextField error={passwordConfirmation.helperText.length > 0 && passwordConfirmation.isError} helperText={passwordConfirmation.helperText} required={true} fullWidth name="passwordConfirmation" label="パスワード確認" placeholder="PasswordConfirmation" margin="normal" onChange={handleChange} type="password" />
                    </CardContent>
                    <CardActions>
                        <Button type="submit" variant="contained" size="large" color="secondary" className={classes.loginBtn} disabled={buttonDisabled}>登録</Button>
                    </CardActions>
                </form>
            </Card>
        </Modal>
    );
}
