import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Box, Avatar, Tooltip, Zoom } from '@material-ui/core';
import { Create as CreateIcon, Code as CodeIcon, Style as StyleIcon, Favorite as FavoriteIcon, Visibility as VisibilityIcon } from '@material-ui/icons';
import { Link, useLocation } from "react-router-dom";
import CopyToClipBoard from 'react-copy-to-clipboard';
import User from '../auth/User';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "1rem"
        // backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        backgroundColor: "lightgray",
    },
    tab: {
        // color: "#FFF"
    },
    tabContent: {
        display: "flex",
        height: "300px",
        border: "1px solid lightgray",
        marginBottom: "1rem",
        background: "white"
    },
    tabpanel: {
        width: "calc(100% - 70px)",
        borderRight: "1px solid lightgray",
        overflow: "auto",
    },
    tabItems: {

    },
    avatar: {
        margin: "1rem",
        cursor: "pointer",
        backgroundColor: "skyBlue",
    },
}));

// 追加
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other} >
            {children}
        </div>
    );
}


export default function CenteredTabs(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [favorite, setFavorite] = useState(props.design.Favorites.length > 0 ? true : false);
    const [favoriteStyle, setFavoriteStyle] = useState(props.design.Favorites.length > 0 ? {color: "red"} : {color: "white"});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const favoriteAdd = (e) => {
        e.preventDefault();

        if(favorite == false) {
            axios.post('http://localhost:3001/favorites/', {
                user_id: Number(User.get('id')),
                design_id: props.design.id,
            }).then(response => {
                setFavoriteStyle({color: "red"});
                console.log(response.data);
                setFavorite(true);
            }).catch(error => {
                console.log(error);
            });
        } else {
            axios.delete(`http://localhost:3001/favorites/?user_id=${User.get('id')}&design_id=${props.design.id}`)
            .then(response => {
                setFavoriteStyle({color: "white"});
                setFavorite(false);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    const handlePreview = (e) => {
         window.open( "/designs/show/" + props.design.id, 'preview', 'top=0,left=0,width=600,height=2000' )
    }

    const location = useLocation();
    const FavoriteButton = (props) => {
        if(User.isLoggedIn()) {
            return (
                <Avatar className={classes.avatar} onClick={favoriteAdd}>
                    <FavoriteIcon style={favoriteStyle} />
                </Avatar>
            )
        } else {
            return (
                <Avatar className={classes.avatar} component={Link} to={{pathname: '/login', state: { background: location },}}>
                    <FavoriteIcon style={favoriteStyle} />
                </Avatar>
            )
        }
    };

    return (
        <div>
            <Paper className={classes.root}>
                <Tabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
                    {props.labels.map(label => <Tab className={classes.tab} label={label}></Tab>)}
                </Tabs>
            </Paper>
            <div className={classes.tabContent}>
                {props.children.map((child, index) =>
                    <TabPanel className={classes.tabpanel} value={value} index={index}>{child}</TabPanel>
                )}
                <div className={classes.tabItems}>
                    <Tooltip TransitionComponent={Zoom} title="HTMLコピー">
                        <CopyToClipBoard text={props.design.html} className={classes.avatar}>
                            <Avatar onClick={props.snackbar}><CodeIcon /></Avatar>
                        </CopyToClipBoard>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} title="CSSコピー">
                        <CopyToClipBoard text={props.design.css} className={classes.avatar}>
                            <Avatar onClick={props.snackbar}><StyleIcon /></Avatar>
                        </CopyToClipBoard>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} title="プレビュー">
                        <Avatar className={classes.avatar} onClick={handlePreview}>
                            <VisibilityIcon />
                        </Avatar>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} title="お気に入り">
                        <div><FavoriteButton /></div>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} title="作成ユーザー">
                        <Avatar className={classes.avatar} src={props.design.User.icon}>
                            {props.design.User.username.slice(0,1) }
                        </Avatar>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
