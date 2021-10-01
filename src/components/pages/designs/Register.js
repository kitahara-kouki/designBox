import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Button, Grid, TextField, Paper, Card, Modal, Snackbar, Slide } from "@material-ui/core";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography } from '@material-ui/core';
import User from "../auth/User";
import AlertDialog from "../../items/AlertDialog";
import axios from 'axios';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
    },
    code: {
        fontSize: 14,
        backgroundColor: 'white',
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    },
    card: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: theme.spacing(10),
        padding: '1rem',
        width: '680px'
    },
    errorMessage: {
        color: '#FF476F',
        padding: '1rem'
    }
}));

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

export default function Register(props)  {
    const history = useHistory();
    const classes = useStyles();
    const [designId, setDesignId] = useState(props.location.search.substring(1).split('=')[1]);
    const [submitButton, setSubmitButton] = useState('登　録');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({ id: 1, label: 'レイアウト'});
    const [title, setTitle] = useState({value: '', isError: true, helperText: ''});
    const [desc, setDesc] = useState({value: '', isError: true, helperText: ''});
    const [html, setHtml] = useState({value: '', isError: true, helperText: ''});
    const [css, setCss] = useState({value: '', isError: true, helperText: ''});

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [snackOpen, setSnackOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);
    const handleSnackOpen = () => {
        setTransition(() => TransitionUp);
        setSnackOpen(true);
        setTimeout(function(){
            setSnackOpen(false);
        }.bind(this),3000)
    };

    const handleSnackClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if(designId != undefined) {
                const result = await axios('http://localhost:3001/designs/' + designId);
                const design = result.data;
                setCategory({ id: design.category_id, label: design.Category.name});
                setTitle({ value: design.title, isError: false, helperText: ''});
                setDesc({ value: design.desc, isError: false, helperText: ''});
                setHtml({ value: design.html, isError: false, helperText: ''});
                setCss({ value: design.css, isError: false, helperText: ''});
                setSubmitButton('更　新');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'title':
                if(e.target.value.length >= 20) {
                    setTitle({ value: e.target.value, isError: true, helperText: 'タイトルは20字以内で入力してください。' });
                } else {
                    setTitle({ value: e.target.value, isError: false, helperText: '' });
                }
                break;
            case 'desc':
                if(e.target.value.length >= 100) {
                    setDesc({ value: e.target.value, isError: true, helperText: '説明文は100字以内で入力してください。' });
                } else {
                    setDesc({ value: e.target.value, isError: false, helperText: '' });
                }
                break;
            case 'category':
                setCategory({ id: Number(e.target.value), label: e.target.parentElement.parentElement.dataset.label });
                setHtml({ value: e.target.parentElement.parentElement.dataset.html, isError: false, helperText: '' });
                setCss({ value: e.target.parentElement.parentElement.dataset.css, isError: false, helperText: '' });
                handleClose();
                break;
            case 'html':
                setHtml({ value: e.target.value, isError: false, helperText: '' });
                break;
            case 'css':
                setCss({ value: e.target.value, isError: false, helperText: '' });
                break;
            default:
                console.log('key not found');
        }
    };

    const radioList = [];

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://localhost:3001/categories/');
            setCategories(result.data);
        };

        fetchData();
    }, []);

    for (var i = 0; i < categories.length; i++) {
        radioList.push(
            <div>
                <FormControlLabel control={<Radio checked={category.id === categories[i].id} onChange={handleChange} name="category" value={categories[i].id} data-label={categories[i].name} data-html={categories[i].html} data-css={categories[i].css} />} label={categories[i].name} />
                <Grid container spacing={0} style={{marginLeft: "3rem"}}>
                    {categories[i].Categories.map((child) => (
                        <Grid item xs={4}>
                            <FormControlLabel control={<Radio checked={category.id === child.id} onChange={handleChange} name="category" value={child.id} data-label={child.name} data-html={child.html} data-css={child.css} />} label={child.name} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(title.value == '' || title.value == undefined) {
            setTitle({ value: e.target.value, isError: true, helperText: 'タイトルを入力してください。'});
        } else if(desc.value == '' || desc.value == undefined) {
            setDesc({ value: e.target.value, isError: true, helperText: '説明文を入力してください。'});
        } else if(html.value === '' || html.value == null || html.value == undefined) {
            setHtml({ value: e.target.value, isError: true, helperText: 'HTMLが入力されていません。'});
        } else if(css.value === '' || css.value == undefined) {
            setCss({ value: e.target.value, isError: true, helperText: 'CSSが入力されていません。'});
        } else if(!title.isError && !desc.isError && !html.isError && !css.isError) {
            axios.post('http://localhost:3001/designs', {
                id: designId,
                user_id: User.get('id'),
                category_id: category.id,
                title: title.value,
                desc: desc.value,
                html: html.value,
                css: css.value
            }).then(response => {
                if(response.data[0] != 1) {
                    setDesignId(response.data.id);
                    setSubmitButton('更　新');
                }
                handleSnackOpen();
            }).catch(error => {
                console.log(error);
            });
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();

        axios.delete('http://localhost:3001/designs/' + designId)
        .then(response => {
            history.push("/users/show/" + User.get('id'));
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <form>
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <Typography component="h2" variant="h5" color="inherit" noWrap className={classes.pageTitle}>デザイン作成</Typography>
                </Grid>
                <Grid item xs={4}>
                    <div style={{display: "flex", float: "right"}}>
                        {designId != undefined && (<AlertDialog action={handleDelete} />)}
                        <Button type="submit" color="primary" variant="contained" onClick={handleSubmit} style={{marginLeft: "1rem"}}>{submitButton}</Button>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <Paper style={{padding: "1rem", height: "100%"}}>
                        <Grid container spacing={0}>
                            <Grid item xs={7}>
                                <Typography variant="h6" color="inherit" noWrap>カテゴリー</Typography>
                            </Grid>
                            <Grid item xs={5} style={{textAlign: "right"}}>
                                <Button color="lightgray" variant="outlined" onClick={handleOpen}>変　更</Button>
                                <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
                                    <Card className={classes.card}>
                                        <FormControl component="fieldset">{radioList}</FormControl>
                                    </Card>
                                </Modal>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" color="inherit" noWrap style={{marginTop: "1rem", textAlign: "center"}}>{category.label}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper style={{padding: "1rem"}}>
                        <TextField error={title.helperText.length > 0 && title.isError} helperText={title.helperText} name="title" label="タイトル" placeholder="20字以内で入力" className={classes.textField} value={title.value} onChange={handleChange} autoComplete="off" />
                        <TextField error={desc.helperText.length > 0 && desc.isError} helperText={desc.helperText} name="desc" label="説明文" placeholder="100字以内で入力" className={classes.textField} value={desc.value} onChange={handleChange} autoComplete="off" />
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper style={{padding: "3px"}}>
                        <div style={{width: "100%", height: "230px", overflow: "scroll"}}>
                            <CodeEditor value={html.value} name="html" language="html" placeholder="HTMLを入力してください。" minHeight={180} className={classes.code} onChange={handleChange} />
                        </div>
                        {html.helperText.length > 0 && html.isError && (<div className={classes.errorMessage}>{html.helperText}</div>)}
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Paper style={{padding: "3px"}}>
                        <div style={{height: "230px", overflow: "scroll"}}>
                            <CodeEditor value={css.value} name="css" language="css" placeholder="CSSを入力してください。" minHeight={180} className={classes.code} onChange={handleChange} />
                        </div>
                        {css.helperText.length > 0 && css.isError && (<div className={classes.errorMessage}>{css.helperText}</div>)}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper style={{padding: "1rem", height: "210px", overflow: "scroll"}}>
                        <Typography variant="h6" color="inherit" noWrap>Preview</Typography>
                        <style>{css.value}</style>
                        <div dangerouslySetInnerHTML={{__html: html.value}}></div>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={snackOpen} onClose={handleSnackClose} TransitionComponent={transition} message="デザインを保存しました。" key={transition ? transition.name : ''} />
        </form>
    );
}
