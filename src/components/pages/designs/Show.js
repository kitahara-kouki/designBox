import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Button, Grid, TextField } from "@material-ui/core";
import axios from 'axios';

//cssのスタイルを定義する
const useStyles = makeStyles(theme => ({

}));

function Show(props)  {
    const id = props.match.params.id;
    const classes = useStyles();
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://localhost:3001/designs/' + id,);
            setHtml(result.data.html);
            setCss(result.data.css);
        };

        fetchData();
    }, []);

    return (
        <div>
            <style>{css}</style>
            <div className={"preview"} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    );
}

export default Show;
