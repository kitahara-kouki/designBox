import React, { useState, useEffect } from 'react';
import clsx from "clsx";
import { createTheme } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography, Divider, Container, Button, IconButton, ListItem, ListItemIcon, ListItemText, Avatar } from "@material-ui/core";
import { Home as HomeIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Create as CreateIcon } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import ToggleListMenu from "./ToggleListMenu";
import User from "../pages/auth/User";

import axios from 'axios';

const drawerWidth = 240;

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

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        background: "white"
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: "none",
    },
    title: {
        flexGrow: 1,
    },
    pageTitle: {
        marginBottom: theme.spacing(1),
    },
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        background: '#EEE',
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    sidebar: {
        overflow: 'scroll',
        height: '90vh',

    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    link: {
        textDecoration: "none",
        color: theme.palette.text.secondary,
    },
    loginBtn: {
        color: 'white',
        borderColor: 'white',
    }
}));

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" to="/">管理画面</Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
};

export default function GenericTemplate(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    // const [data, setData] = useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await axios('http://localhost:3001/categories/',);
    //         setData(result.data)
    //     };
    //
    //     fetchData();
    // }, []);

    const list = [];
    const data = [
        {
            "id": 1,
            "parent_id": null,
            "name": "レイアウト",
            "Categories": [
                {"id": 7, "parent_id": 1, "name": "ヘッダー"},
                {"id": 8, "parent_id": 1, "name": "コンテナ"},
                {"id": 9, "parent_id": 1, "name": "サイドバー"},
                {"id": 10,"parent_id": 1,"name": "フッター"}
            ]
        },
        {
            "id": 2,
            "parent_id": null,
            "name": "アイテム",
            "Categories": [
                {"id": 11, "parent_id": 2, "name": "見出し"},
                {"id": 12, "parent_id": 2, "name": "ボタン"},
                {"id": 13, "parent_id": 2, "name": "アイコン"}
            ]
        },
        {
            "id": 3,
            "parent_id": null,
            "name": "データ表示",
            "Categories": [
                {"id": 14, "parent_id": 3, "name": "テーブル"},
                {"id": 15, "parent_id": 3, "name": "リスト"},
                {"id": 16, "parent_id": 3, "name": "カード"}
            ]
        },
        {
            "id": 4,
            "parent_id": null,
            "name": "フォーム",
            "Categories": [
                {"id": 17, "parent_id": 4, "name": "インプット"},
                {"id": 18, "parent_id": 4, "name": "チェックボックス"},
                {"id": 19, "parent_id": 4, "name": "ラジオボタン"},
                {"id": 20, "parent_id": 4, "name": "テキストエリア"},
                {"id": 21, "parent_id": 4, "name": "セレクト"},
                {"id": 22, "parent_id": 4, "name": "日付時刻"}
            ]
        },
        {
            "id": 5,
            "parent_id": null,
            "name": "ナビゲーション",
            "Categories": [
                {"id": 23, "parent_id": 5, "name": "リンク"},
                {"id": 24, "parent_id": 5, "name": "ボトムナビゲーション"},
                {"id": 25, "parent_id": 5, "name": "パンくずリスト"}
            ]
        },
        {
            "id": 6,
            "parent_id": null,
            "name": "ユーティリティ",
            "Categories": [
                {"id": 26, "parent_id": 6, "name": "モーダル"},
                {"id": 27, "parent_id": 6, "name": "タブ"},
                {"id": 28, "parent_id": 6, "name": "ツールチップ"}
            ]
        }
    ]
    for (var i = 0; i < data.length; i++) {
        list.push(
            <ToggleListMenu name={data[i].name} id={data[i].id} categories={data[i].Categories}></ToggleListMenu>
        )
    }

    const location = useLocation();
    const LoginButton = (props) => {
        if(User.isLoggedIn()) {
            return (
                <Avatar src={User.get('icon')} component={Link} to={'/users/show/' + User.get('id')}>
                    {User.get('username').slice(0,1) }
                </Avatar>
            )
        } else {
            return (<Button variant="outlined" className={classes.loginBtn} component={Link} to={{pathname: '/login', state: { background: location },}}>ログイン</Button>)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx( classes.menuButton, open && classes.menuButtonHidden)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>デザインボックス</Typography>
                        <LoginButton />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose), }} open={open}>
                    <div className={classes.toolbarIcon}>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="トップページ" />
                        </ListItem>
                    </div>
                    <Divider />
                    <List className={classes.sidebar}>
                        {list}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        {props.children}
                        <Box pt={2}><Copyright /></Box>
                    </Container>
                </main>
            </div>
        </ThemeProvider>
    );
};
// <Typography component="h2" variant="h5" color="inherit" noWrap className={classes.pageTitle}>{props.title}</Typography>
// <IconButton onClick={handleDrawerClose}>
//     <ChevronLeftIcon />
// </IconButton>
