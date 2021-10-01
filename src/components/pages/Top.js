import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const useStyles = makeStyles((theme) => ({
    section: {
        marginBottom: "2rem",
    },
    content: {
        marginLeft: "2rem",
        fontSize: "18px",
    },
    code: {
        fontSize: "18px",
    },
}));

export default function Top() {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.section}>
                <Typography component="h3" variant="h4" noWrap>デザインボックスとは</Typography>
                <p className={classes.content}>
                    デザインボックスでは、様々な人が考えたWebデザインを評価し、コピーして自分のサイトに使うことができます。<br />
                    また、自分の考えたデザインを作成し投稿することで多くの人に利用してもらうことができます。
                </p>
            </div>

            <div className={classes.section}>
                <Typography component="h3" variant="h4" noWrap>外部ライブラリ</Typography>
                <p className={classes.content}>
                    <Typography component="h3" variant="h5" noWrap>Font Awesome</Typography>
                    <p>
                        デザインボックスでは、Font Awesomeのアイコンを使ったデザインを作成するとができます。<br />
                        Font Awesomeを使ったデザインを自分のサイトに載せたい場合は、以下のlinkタグをサイトのheadタグに入れてください。
                    </p>
                    <a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">Font Awesome公式ページ</a>
                    <SyntaxHighlighter language="htmlbars" className={classes.code} style={atomOneDark}>
                        {'<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />'}
                    </SyntaxHighlighter>
                </p>
            </div>
        </div>
    );
}
