import React, {useState} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles, createTheme } from '@material-ui/core/styles';
import { Card, Modal, Slide } from '@material-ui/core/';
import SignIn from './SignIn';
import SignUp from './SignUp';

const theme = createTheme({
    typography: {
        fontFamily: ["Noto Sans JP", "Lato", "游ゴシック Medium", "游ゴシック体", "Yu Gothic Medium", "YuGothic", "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", "メイリオ", "Meiryo", "ＭＳ Ｐゴシック", "MS PGothic", "sans-serif",].join(","),
    },
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});


const useStyles = makeStyles((theme) => ({
    card: {
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: theme.spacing(10),
        width: 450,
        minHeight: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}));

export default function Auth(props) {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const [open, setOpen] = useState(true);
    const [signIn, setSignIn] = useState({in: true, direction: "right"});
    const [signUp, setSignUp] = useState({in: false, direction: "left"});

    const handleClose = () => {
        history.goBack();
        setOpen(false);
    };

    const handleChangeSignIn = (e) => {
        setSignUp({in: false, direction: "left"});
        setTimeout(function(){
            setSignIn({in: true, direction: "right"});
        }.bind(this),250)

    };

    const handleChangeSignUp = (e) => {
        setSignIn({in: false, direction: "right"});
        setTimeout(function(){
            setSignUp({in: true, direction: "left"});
        }.bind(this),250)

    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
            <Card className={classes.card}>
                <Slide direction="right" in={signIn.in} mountOnEnter unmountOnExit>
                    <div>
                        <SignIn handleChangeSignUp={handleChangeSignUp} handleClose={handleClose} />
                    </div>
                </Slide>
                <Slide direction="left" in={signUp.in} mountOnEnter unmountOnExit>
                    <div>
                        <SignUp handleChangeSignIn={handleChangeSignIn} handleClose={handleClose} />
                    </div>
                </Slide>
            </Card>
        </Modal>
    );
}
