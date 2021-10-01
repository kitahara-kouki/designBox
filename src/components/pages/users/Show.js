import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Avatar, Paper, Button, TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import EnhancedTable from "./EnhancedTable";
import User from "../auth/User";
import axios from 'axios';

//cssのスタイルを定義する
const useStyles = makeStyles(theme => ({
    paper: {
        padding: '1rem',
    },
    avatar: {
        width: 100,
        height: 100,
        margin: "auto",
        cursor: "pointer"
    },
    profileItem: {
        marginTop: "15px",
        fontSize: "16px",
    },
    profileLabel: {
        fontWeight: "bold"
    },
    profileText: {
        marginLeft: "1rem"
    },
}));

function Show(props)  {
    const classes = useStyles();
    const [user, setUser] = useState({id: '', username: '', icon: '', Designs: ''});
    const [editing, setEditing] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://localhost:3001/users/' + props.match.params.id);
            setUser(result.data);
        };

        fetchData();
    }, []);

    const handleLogout = (e) => {
        User.logout();
        history.push("/");
    };

    const [userIcon, setUserIcon] = useState({url: user.icon});
    const inputRef = useRef(null);

    const onFileInputChange = (e) => {
        const imageFile = e.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        console.log(imageUrl)
        setUserIcon({url: imageUrl})
    };

    // uploadImage(file) {
    //     return axios.get('/upload', {
    //         params: {
    //             filename: file.name,
    //             filetype: file.type
    //         }
    //     }).then(res => {
    //         const options = {
    //             headers: {
    //                 'Content-Type': file.type
    //             }
    //         };
    //         return axios.put(res.data.url, file, options);
    //     }).then(res => {
    //         const {name} = res.config.data;
    //         return {
    //             name,
    //             isUploading: true,
    //             url: `https://[バケット名を入れてください].s3.amazonaws.com/${file.name}`
    //         };
    //     });
    // }

    const fileUpload = () => {
        inputRef.current.click();
    };

    const handleEdit = (e) => {
        setEditing(true);
    }

    const handleChange = (e) => {
        setUser({ ...user, username: e.target.value });
    }

    const handleSubmit = (e) => {
        setEditing(false);
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Paper className={classes.paper} style={{ position: "relative", textAlign: "center", height: "100%" }}>
                    <input type="file" accept="image/*" hidden ref={inputRef} onChange={onFileInputChange} />
                    <Avatar className={classes.avatar} src={userIcon.url} onClick={fileUpload}>
                        <b style={{fontSize: "60px"}}>{user.username.slice(0,1)}</b>
                    </Avatar>
                    <div style={{ marginTop: "1rem" }}>
                        {editing ? (
                            <form>
                                <TextField value={user.username} onChange={handleChange} onBlur={handleSubmit} autoFocus style={{ width: "100%" }} />
                            </form>
                        ) : (
                            <Typography variant="h5" onClick={handleEdit} style={{ cursor: "pointer", position: "relative" }}>
                                <span>{user.username}</span>
                                <EditIcon style={{ position: "absolute", top: 5, right: 0, }} />
                            </Typography>
                        )}
                    </div>
                    <Button variant="outlined" className={classes.loginBtn} onClick={handleLogout} style={{ position: "absolute", top: 5, left: 5, }}>ログアウト</Button>
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Paper className={classes.paper} style={{ height: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={8}>
                            <Typography component="h2" variant="h6" color="inherit" noWrap>プロフィール</Typography>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: "right" }}>
                            <Button color="primary" variant="outlined" component={Link} to={'/profile/register'}>編 集</Button>
                        </Grid>
                    </Grid>
                    <div>
                        <div className={classes.profileItem}>
                            <span className={classes.profileLabel}>職種　　　：</span>
                            <span className={classes.profileText}>エンジニア</span>
                        </div>
                        <div className={classes.profileItem}>
                            <span className={classes.profileLabel}>スキル　　：</span>
                            <span className={classes.profileText}>React RubyOnRails Laravel</span>
                        </div>
                        <div className={classes.profileItem}>
                            <span className={classes.profileLabel}>コメント　：</span>
                            <span className={classes.profileText}>ベンチャー企業でフロントエンジニアをしています。</span>
                        </div>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <EnhancedTable designs={user.Designs} />
            </Grid>
        </Grid>
    );
}

export default Show;
