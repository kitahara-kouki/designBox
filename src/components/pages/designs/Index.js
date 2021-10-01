import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Fab, Button, Input, Typography, Snackbar, Slide, Paper } from '@material-ui/core';
import { Add as AddIcon, Search as SearchIcon } from '@material-ui/icons';
import { Link, useLocation } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import User from '../auth/User';
import CenteredTabs from "./CenteredTabs";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
    code: {
        fontSize: "18px",
        margin: 0,
        height: "100%",
    },
    search: {
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        justifyContent: "flex-end"
    },
    searchBar: {
        display: "flex",
        alignItems: "center",
        padding: "2px 5px",
        border: "1px solid lightgray",
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
        // borderRadius: "5px",
        backgroundColor: "white",//"#f0f2f5",
    },
    searchIcon: {
        margin: "0 5px",
    },
    searchInput: {
        border: "none",
        backgroundColor: "white",//"#f0f2f5",
        width: "300px",
    },
    searchButton: {
        // marginLeft: "1rem",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        borderTopRightRadius: "5px",
        borderBottomRightRadius: "5px",
        borderLeft: "none",
        padding: "6px 1rem",
    },
    iframe: {
        border: "none",
    }
}));
// .search__bar > input:focus {
//     outline-width: 0;
// }
// .search__bar > input::placeholder{
//     text-align: left;
//     font-size: 15px;
// }

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {...state, isLoading: true, isError: false};
        case 'FETCH_SUCCESS':
            return {...state, isLoading: false, isError: false, data: action.payload};
        case 'FETCH_FAILURE':
            return {...state, isLoading: false, isError: true };
        default:
            throw new Error();
    }
};

const useDataApi = (initialUrl, initialData) => {
    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [state, dispatch] = useReducer(dataFetchReducer, {isLoading: false, isError: false, data: initialData});

    useEffect(async () => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const result = await axios(url);
                if (!didCancel) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                }
            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: 'FETCH_FAILURE' });
                }
            }
        };

        fetchData();
        return () => {
            didCancel = true;
        };
    }, [url]);
    return [state, setUrl];
}

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

export default function Index(props) {
    const category_id = props.match.params.category_id;
    const classes = useStyles();
    const [query, setQuery] = useState('');
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
        `http://localhost:3001/designs/?category=${category_id}&user_id=${User.get('id')}`,
        { hits: [] }
    );

    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);

    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true);
        setTimeout(function(){
            setOpen(false);
        }.bind(this),3000)
    };

    const handleClose = () => {
        setOpen(false);
    };

    var list = []

    for (var i = 0; i < data.length; i++) {
        list.push(
            <div>
                <Typography component="h3" variant="h5" color="primary" noWrap>{data[i].title}</Typography>
                <p>{data[i].desc}</p>
                <CenteredTabs labels={['ビュー', 'HTML', 'CSS']} design={data[i]} snackbar={handleClick(TransitionUp)}>
                    <iframe src={"/designs/show/" + data[i].id} width="100%" height="100%" className={classes.iframe}></iframe>
                    <SyntaxHighlighter language="htmlbars" className={classes.code} style={atomOneDark}>{data[i].html}</SyntaxHighlighter>
                    <SyntaxHighlighter language="CSS" className={classes.code} style={atomOneDark}>{data[i].css}</SyntaxHighlighter>
                </CenteredTabs>
            </div>
        )
    }

    const location = useLocation();
    const AddButton = (props) => {
        if(User.isLoggedIn()) {
            return (
                <Fab className={classes.fab} color="primary" aria-label="add" component={Link} to={'/designs/register/'}>
                    <AddIcon />
                </Fab>
            )
        } else {
            return (
                <Fab className={classes.fab} color="primary" aria-label="add" component={Link} to={{pathname: '/login', state: { background: location },}}>
                    <AddIcon />
                </Fab>
            )
        }
    };
    
    return (
        <div>
            <form onSubmit={event => { doFetch(`http://localhost:3001/designs/category/?category=${category_id}&title=${query}`); event.preventDefault(); }}>
                <div className={classes.search}>
                    <div className={classes.searchBar}>
                        <SearchIcon className={classes.searchIcon}/>
                        <Input placeholder="Search…" disableUnderline className={classes.searchInput} onChange={e => setQuery(e.target.value)} value={query} />
                    </div>
                    <Button type="submit" variant="outlined" color="" className={classes.searchButton}>search</Button>
                </div>
            </form>
            {isError && <div>Something went wrong ...</div>}
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <div>{list}</div>
            )}
            <AddButton />
            <Snackbar open={open} onClose={handleClose} TransitionComponent={transition} message="ソースコードをコピーしました。"　key={transition ? transition.name : ''} />
        </div>
    );
}
